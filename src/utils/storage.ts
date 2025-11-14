import { supabase } from '../contexts/AuthContext';

type ImageCompressionOptions = {
  /** Only compress when original exceeds this size (bytes). Defaults to 150KB. */
  minSizeBytes?: number;
  /** Maximum width for the output image. */
  maxWidth?: number;
  /** Maximum height for the output image. */
  maxHeight?: number;
  /** Quality factor passed to canvas.toBlob (0-1). Defaults to 0.82. */
  quality?: number;
  /** Target MIME type. Defaults to original file type when supported, JPEG otherwise. */
  convertTo?: string;
  /** Target maximum output size in bytes. Defaults to 100KB. */
  maxOutputBytes?: number;
  /** Lowest quality allowed when iteratively compressing. Defaults to 0.55. */
  minQuality?: number;
  /** Amount to reduce quality by on each iteration. Defaults to 0.05. */
  qualityStep?: number;
  /** Multiplier applied to dimensions when additional downsizing is required. Defaults to 0.9. */
  resizeStep?: number;
};

type UploadOptions = {
  /** Supabase storage bucket name. Defaults to VITE_SUPABASE_STORAGE_BUCKET or 'public'. */
  bucket?: string;
  /** Optional virtual folder within the bucket. */
  folder?: string;
  /** Control image compression behaviour. */
  compression?: ImageCompressionOptions;
  /** Cache-Control header (in seconds). Defaults to 3600. */
  cacheControl?: string;
  /** Whether to overwrite existing file if path collides. Defaults to false. */
  upsert?: boolean;
};

type UploadResult = {
  publicUrl: string;
  path: string;
  bucket: string;
  didCompress: boolean;
};

const defaultCompression: Required<ImageCompressionOptions> = {
  minSizeBytes: 150 * 1024,
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  convertTo: 'image/webp',
  maxOutputBytes: 100 * 1024,
  minQuality: 0.55,
  qualityStep: 0.05,
  resizeStep: 0.9,
};

const SUPPORTED_COMPRESS_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const loadImage = (file: File): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const imageUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(imageUrl);
    resolve(image);
  };
  image.onerror = (error) => {
    URL.revokeObjectURL(imageUrl);
    reject(error);
  };
  image.src = imageUrl;
});

const getFileExtension = (mimeType: string) => {
  const [, ext] = mimeType.split('/');
  return ext ?? 'jpg';
};

const generateFileName = (ext: string) => {
  const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
  return `${uuid}.${ext}`;
};

const compressImage = async (file: File, options?: ImageCompressionOptions) => {
  const settings = { ...defaultCompression, ...options };

  if (!file.type.startsWith('image/')) {
    return { blob: file, didCompress: false, mimeType: file.type };
  }

  const targetMaxBytes = settings.maxOutputBytes;
  const shouldSkipBySize = file.size < settings.minSizeBytes
    && (!targetMaxBytes || file.size <= targetMaxBytes);

  if (shouldSkipBySize && (!settings.convertTo || settings.convertTo === file.type)) {
    return { blob: file, didCompress: false, mimeType: file.type };
  }

  const sourceIsSupported = SUPPORTED_COMPRESS_TYPES.includes(file.type);
  const outputMime = settings.convertTo ?? (sourceIsSupported ? file.type : 'image/jpeg');

  const image = await loadImage(file);

  const initialScale = Math.min(1,
    settings.maxWidth / image.width,
    settings.maxHeight / image.height,
  );

  const createBlob = async (scale: number, quality: number) => {
    const safeScale = Math.max(Math.min(scale, 1), 0.05);
    const width = Math.max(1, Math.round(image.width * safeScale));
    const height = Math.max(1, Math.round(image.height * safeScale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0, width, height);

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((generatedBlob) => resolve(generatedBlob), outputMime, quality);
    });
  };

  let currentScale = Number.isFinite(initialScale) && initialScale > 0 ? initialScale : 1;
  let currentQuality = settings.quality;
  const minQuality = Math.min(settings.minQuality, settings.quality);
  const qualityStep = Math.max(0.01, settings.qualityStep);
  const resizeStep = Math.min(settings.resizeStep, 0.95);
  const minScale = 0.15;
  const maxIterations = 12;

  let blob = await createBlob(currentScale, currentQuality);
  if (!blob) {
    return { blob: file, didCompress: false, mimeType: file.type };
  }

  let bestWithinTarget: Blob | null = targetMaxBytes && blob.size <= targetMaxBytes ? blob : null;
  let smallestBlob = blob;

  let iterations = 0;
  while (targetMaxBytes && blob.size > targetMaxBytes && iterations < maxIterations) {
    iterations += 1;

    if (currentQuality > minQuality + 1e-3) {
      currentQuality = Math.max(minQuality, currentQuality - qualityStep);
    } else if (currentScale > minScale) {
      currentScale = Math.max(minScale, currentScale * resizeStep);
      currentQuality = settings.quality;
    } else {
      break;
    }

    const nextBlob = await createBlob(currentScale, currentQuality);
    if (!nextBlob) break;
    blob = nextBlob;

    if (blob.size < smallestBlob.size) {
      smallestBlob = blob;
    }

    if (blob.size <= targetMaxBytes) {
      if (!bestWithinTarget || blob.size < bestWithinTarget.size) {
        bestWithinTarget = blob;
      }
      break;
    }
  }

  const finalBlob = bestWithinTarget ?? smallestBlob;

  const finalSize = finalBlob.size;
  const originalSize = file.size;
  const originalWithinTarget = targetMaxBytes ? originalSize <= targetMaxBytes : false;

  const shouldKeepOriginal = (finalSize >= originalSize && (!targetMaxBytes || originalWithinTarget))
    || (targetMaxBytes && finalSize > targetMaxBytes && originalWithinTarget);

  if (shouldKeepOriginal) {
    return { blob: file, didCompress: false, mimeType: file.type };
  }

  const didCompress = finalSize < originalSize || outputMime !== file.type;

  return { blob: finalBlob, didCompress, mimeType: outputMime };
};

export const uploadImageToSupabase = async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
  if (!file) throw new Error('No file provided for upload.');

  const {
    bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'public',
    folder,
    compression,
    cacheControl = '3600',
    upsert = false,
  } = options;

  const { blob, didCompress, mimeType } = await compressImage(file, compression);

  const extension = getFileExtension(mimeType || file.type || 'image/jpeg');
  const generatedName = generateFileName(extension);
  const path = folder ? `${folder}/${generatedName}` : generatedName;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, blob, {
    cacheControl,
    upsert,
    contentType: mimeType || file.type,
  });

  if (uploadError) {
    throw new Error(uploadError.message ?? 'Failed to upload image to Supabase storage.');
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Unable to resolve public URL for uploaded image.');
  }

  return {
    publicUrl: publicUrlData.publicUrl,
    path,
    bucket,
    didCompress,
  };
};

export const deleteImageFromSupabase = async (path: string, bucket?: string) => {
  if (!path) return;
  const bucketName = bucket ?? import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'public';
  await supabase.storage.from(bucketName).remove([path]);
};
