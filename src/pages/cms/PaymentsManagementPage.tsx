// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// // Skema untuk Payment Instructions
// const InstructionSchema = z.object({
//   method_name: z.string().min(3, 'Method name is required'),
//   instructions_en: z.string().min(10, 'English instructions are required'),
//   instructions_zh_hant: z.string().min(5, 'Chinese instructions are required'),
//   is_active: z.boolean(),
// });
// type InstructionFormInputs = z.infer<typeof InstructionSchema>;
// type Instruction = InstructionFormInputs & { id: string };

// // Skema untuk Proof Contacts
// const ContactSchema = z.object({
//   platform: z.enum(['line', 'instagram', 'email']),
//   contact_info: z.string().min(3, 'Contact info is required'),
//   display_order: z.number(),
//   is_active: z.boolean(),
// });
// type ContactFormInputs = z.infer<typeof ContactSchema>;
// type Contact = ContactFormInputs & { id: string };

// // Komponen Form untuk Payment Instructions
// const InstructionForm = ({ instruction, onFormSubmit, onCancel }: { instruction?: Instruction | null, onFormSubmit: (data: InstructionFormInputs) => void, onCancel: () => void }) => {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InstructionFormInputs>({
//     defaultValues: instruction || {
//       method_name: '',
//       instructions_en: '',
//       instructions_zh_hant: '',
//       is_active: true
//     },
//     resolver: zodResolver(InstructionSchema) as any
//   });
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-6">{instruction ? 'Edit' : 'Create'} Payment Method</h2>
//         <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-4">
//           <div><label className="block text-sm font-medium">Method Name (Internal)</label><input {...register('method_name')} placeholder="e.g., Main Bank Transfer" className="mt-1 w-full p-2 border rounded-md" />{errors.method_name && <p className="text-sm text-system-danger">{errors.method_name.message}</p>}</div>
//           <div><label className="block text-sm font-medium">Instructions (English)</label><textarea {...register('instructions_en')} rows={4} placeholder="Bank: ABC Bank..." className="mt-1 w-full p-2 border rounded-md" />{errors.instructions_en && <p className="text-sm text-system-danger">{errors.instructions_en.message}</p>}</div>
//           <div><label className="block text-sm font-medium">Instructions (Chinese)</label><textarea {...register('instructions_zh_hant')} rows={4} placeholder="銀行：ABC銀行..." className="mt-1 w-full p-2 border rounded-md" />{errors.instructions_zh_hant && <p className="text-sm text-system-danger">{errors.instructions_zh_hant.message}</p>}</div>
//           <div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded" /><label>Is Active</label></div>
//           <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Method'}</button></div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Komponen Form untuk Proof Contacts
// const ContactForm = ({ contact, onFormSubmit, onCancel }: { contact?: Contact | null, onFormSubmit: (data: ContactFormInputs) => void, onCancel: () => void }) => {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormInputs>({
//     defaultValues: contact || {
//       platform: 'line',
//       contact_info: '',
//       display_order: 99,
//       is_active: true
//     },
//     resolver: zodResolver(ContactSchema) as any
//   });
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-6">{contact ? 'Edit' : 'Create'} Proof Contact</h2>
//         <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-4">
//           <div><label className="block text-sm font-medium">Platform</label><select {...register('platform')} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="line">Line</option><option value="instagram">Instagram</option><option value="email">Email</option></select></div>
//           <div><label className="block text-sm font-medium">Contact Info</label><input {...register('contact_info')} placeholder="e.g., @ttisa_ntut or payment@ttisa.com" className="mt-1 w-full p-2 border rounded-md" />{errors.contact_info && <p className="text-sm text-system-danger">{errors.contact_info.message}</p>}</div>
//           <div><label className="block text-sm font-medium">Display Order</label><input type="number" {...register('display_order', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" /></div>
//           <div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded" /><label>Is Active</label></div>
//           <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Contact'}</button></div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export const PaymentInstructionsPage = () => {
//   const [isInstructionFormOpen, setIsInstructionFormOpen] = useState(false);
//   const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
//   const [isContactFormOpen, setIsContactFormOpen] = useState(false);
//   const [editingContact, setEditingContact] = useState<Contact | null>(null);
//   const queryClient = useQueryClient();

//   // Queries
//   const { data: instructions, isLoading: isLoadingInstructions } = useQuery<Instruction[]>({ queryKey: ['payment_instructions'], queryFn: async () => { const { data, error } = await supabase.from('payment_instructions').select('*').order('created_at'); if (error) throw new Error(error.message); return data; }, });
//   const { data: contacts, isLoading: isLoadingContacts } = useQuery<Contact[]>({ queryKey: ['proof_contacts'], queryFn: async () => { const { data, error } = await supabase.from('proof_contacts').select('*').order('display_order'); if (error) throw new Error(error.message); return data; }, });

//   // Mutations
//   const instructionMutation = useMutation({ mutationFn: async (formData: InstructionFormInputs) => { if (editingInstruction) { await supabase.from('payment_instructions').update(formData).eq('id', editingInstruction.id).throwOnError(); } else { await supabase.from('payment_instructions').insert(formData).throwOnError(); } }, onSuccess: () => { toast.success(`Payment method ${editingInstruction ? 'updated' : 'created'}.`); queryClient.invalidateQueries({ queryKey: ['payment_instructions'] }); setIsInstructionFormOpen(false); setEditingInstruction(null); }, onError: (error) => toast.error(error.message), });
//   const contactMutation = useMutation({ mutationFn: async (formData: ContactFormInputs) => { if (editingContact) { await supabase.from('proof_contacts').update(formData).eq('id', editingContact.id).throwOnError(); } else { await supabase.from('proof_contacts').insert(formData).throwOnError(); } }, onSuccess: () => { toast.success(`Proof contact ${editingContact ? 'updated' : 'created'}.`); queryClient.invalidateQueries({ queryKey: ['proof_contacts'] }); setIsContactFormOpen(false); setEditingContact(null); }, onError: (error) => toast.error(error.message), });
//   const deleteInstructionMutation = useMutation({ mutationFn: async (id: string) => { await supabase.from('payment_instructions').delete().eq('id', id).throwOnError(); }, onSuccess: () => { toast.success('Method deleted.'); queryClient.invalidateQueries({ queryKey: ['payment_instructions'] }); }, onError: (error) => toast.error(error.message), });
//   const deleteContactMutation = useMutation({ mutationFn: async (id: string) => { await supabase.from('proof_contacts').delete().eq('id', id).throwOnError(); }, onSuccess: () => { toast.success('Contact deleted.'); queryClient.invalidateQueries({ queryKey: ['proof_contacts'] }); }, onError: (error) => toast.error(error.message), });

//   return (
//     <div className="space-y-8">
//       {isInstructionFormOpen && <InstructionForm instruction={editingInstruction} onFormSubmit={(data) => instructionMutation.mutate(data)} onCancel={() => { setIsInstructionFormOpen(false); setEditingInstruction(null); }} />}
//       {isContactFormOpen && <ContactForm contact={editingContact} onFormSubmit={(data) => contactMutation.mutate(data)} onCancel={() => { setIsContactFormOpen(false); setEditingContact(null); }} />}

//       <div>
//         <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Payment Methods</h2><button onClick={() => { setEditingInstruction(null); setIsInstructionFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Add Method</button></div>
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="min-w-full responsive-table">
//             <thead><tr><th className="p-4 text-left font-semibold">Method Name</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//             <tbody>{isLoadingInstructions ? <tr><td colSpan={3}>Loading...</td></tr> : instructions?.map(instr => (<tr key={instr.id}><td data-label="Name">{instr.method_name}</td><td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${instr.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200'}`}>{instr.is_active ? 'Active' : 'Inactive'}</span></td><td data-label="Actions" className="text-right space-x-2"><button onClick={() => { setEditingInstruction(instr); setIsInstructionFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteInstructionMutation.mutate(instr.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700">Delete</button></td></tr>))}</tbody>
//           </table>
//         </div>
//       </div>

//       <div>
//         <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Proof of Payment Contacts</h2><button onClick={() => { setEditingContact(null); setIsContactFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Add Contact</button></div>
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="min-w-full responsive-table">
//             <thead><tr><th className="p-4 text-left font-semibold">Platform</th><th className="p-4 text-left font-semibold">Contact Info</th><th className="p-4 text-left font-semibold">Order</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//             <tbody>{isLoadingContacts ? <tr><td colSpan={5}>Loading...</td></tr> : contacts?.map(c => (<tr key={c.id}><td data-label="Platform" className="capitalize">{c.platform}</td><td data-label="Contact">{c.contact_info}</td><td data-label="Order">{c.display_order}</td><td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td><td data-label="Actions" className="text-right space-x-2"><button onClick={() => { setEditingContact(c); setIsContactFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteContactMutation.mutate(c.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700">Delete</button></td></tr>))}</tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, useAuth } from '../../contexts/AuthContext'; // <-- Impor useAuth
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Komponen Pagination mungkin perlu diimpor jika ada di file terpisah
// import { Pagination } from '../../components/Pagination'; 

// Skema untuk Payment Instructions
const InstructionSchema = z.object({
  method_name: z.string().min(3, 'Method name is required'),
  instructions_en: z.string().min(10, 'English instructions are required'),
  instructions_zh_hant: z.string().min(5, 'Chinese instructions are required'),
  is_active: z.boolean(),
});
type InstructionFormInputs = z.infer<typeof InstructionSchema>;
type Instruction = InstructionFormInputs & { id: string };

// Skema untuk Proof Contacts
const ContactSchema = z.object({
  platform: z.enum(['line', 'instagram', 'email']),
  contact_info: z.string().min(3, 'Contact info is required'),
  display_order: z.number(),
  is_active: z.boolean(),
});
type ContactFormInputs = z.infer<typeof ContactSchema>;
type Contact = ContactFormInputs & { id: string };

// Komponen Form untuk Payment Instructions
const InstructionForm = ({ instruction, onFormSubmit, onCancel }: { instruction?: Instruction | null, onFormSubmit: (data: InstructionFormInputs) => void, onCancel: () => void }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InstructionFormInputs>({
    defaultValues: instruction || {
      method_name: '',
      instructions_en: '',
      instructions_zh_hant: '',
      is_active: true
    },
    resolver: zodResolver(InstructionSchema) as any
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{instruction ? 'Edit' : 'Create'} Payment Method</h2>
        <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-4">
          <div><label className="block text-sm font-medium">Method Name (Internal)</label><input {...register('method_name')} placeholder="e.g., Main Bank Transfer" className="mt-1 w-full p-2 border rounded-md" />{errors.method_name && <p className="text-sm text-system-danger">{errors.method_name.message}</p>}</div>
          <div><label className="block text-sm font-medium">Instructions (English)</label><textarea {...register('instructions_en')} rows={4} placeholder="Bank: ABC Bank..." className="mt-1 w-full p-2 border rounded-md" />{errors.instructions_en && <p className="text-sm text-system-danger">{errors.instructions_en.message}</p>}</div>
          <div><label className="block text-sm font-medium">Instructions (Chinese)</label><textarea {...register('instructions_zh_hant')} rows={4} placeholder="銀行：ABC銀行..." className="mt-1 w-full p-2 border rounded-md" />{errors.instructions_zh_hant && <p className="text-sm text-system-danger">{errors.instructions_zh_hant.message}</p>}</div>
          <div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded" /><label>Is Active</label></div>
          <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Method'}</button></div>
        </form>
      </div>
    </div>
  );
};

// Komponen Form untuk Proof Contacts
const ContactForm = ({ contact, onFormSubmit, onCancel }: { contact?: Contact | null, onFormSubmit: (data: ContactFormInputs) => void, onCancel: () => void }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormInputs>({
    defaultValues: contact || {
      platform: 'line',
      contact_info: '',
      display_order: 99,
      is_active: true
    },
    resolver: zodResolver(ContactSchema) as any
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{contact ? 'Edit' : 'Create'} Proof Contact</h2>
        <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-4">
          <div><label className="block text-sm font-medium">Platform</label><select {...register('platform')} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="line">Line</option><option value="instagram">Instagram</option><option value="email">Email</option></select></div>
          <div><label className="block text-sm font-medium">Contact Info</label><input {...register('contact_info')} placeholder="e.g., @ttisa_ntut or payment@ttisa.com" className="mt-1 w-full p-2 border rounded-md" />{errors.contact_info && <p className="text-sm text-system-danger">{errors.contact_info.message}</p>}</div>
          <div><label className="block text-sm font-medium">Display Order</label><input type="number" {...register('display_order', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded" /><label>Is Active</label></div>
          <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Contact'}</button></div>
        </form>
      </div>
    </div>
  );
};

export const PaymentInstructionsPage = () => {
  const [isInstructionFormOpen, setIsInstructionFormOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Pagination state
  const [currentInstructionPage, setCurrentInstructionPage] = useState(1);
  const [instructionSearchTerm, setInstructionSearchTerm] = useState('');
  const [currentContactPage, setCurrentContactPage] = useState(1);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  const queryClient = useQueryClient();
  const { session } = useAuth(); // <-- Tambahkan ini

  // Queries using Edge Functions
  const { data: instructionsData, isLoading: isLoadingInstructions } = useQuery({
    queryKey: ['payment_instructions', currentInstructionPage, instructionSearchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-cms-payment-instructions', {
        body: {
          page: currentInstructionPage,
          limit: 20,
          search: instructionSearchTerm,
          type: 'instructions'
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session, // <-- Tambahkan ini
  });

  const { data: contactsData, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['proof_contacts', currentContactPage, contactSearchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-cms-payment-instructions', {
        body: {
          page: currentContactPage,
          limit: 20,
          search: contactSearchTerm,
          type: 'contacts'
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session, // <-- Tambahkan ini
  });

  const instructions = instructionsData?.data || [];
  const instructionsPagination = instructionsData?.pagination;
  const contacts = contactsData?.data || [];
  const contactsPagination = contactsData?.pagination;

  // Handle search
  const handleInstructionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentInstructionPage(1);
    // Kita tidak perlu invalidate di sini, perubahan state page akan memicu refetch
  };

  const handleContactSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentContactPage(1);
    // Kita tidak perlu invalidate di sini, perubahan state page akan memicu refetch
  };

  // Handle pagination
  const handleInstructionPageChange = (newPage: number) => {
    setCurrentInstructionPage(newPage);
  };

  const handleContactPageChange = (newPage: number) => {
    setCurrentContactPage(newPage);
  };

  // Mutations using Edge Functions
  const instructionMutation = useMutation({
    mutationFn: async (formData: InstructionFormInputs) => {
      if (!session) throw new Error("Not authenticated");
      const action = editingInstruction ? 'update' : 'create';
      const id = editingInstruction ? editingInstruction.id : undefined;

      const { error } = await supabase.functions.invoke('crud-payment-instruction', {
        body: { action, type: 'instruction', id, data: formData }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Payment method ${editingInstruction ? 'updated' : 'created'}.`);
      queryClient.invalidateQueries({ queryKey: ['payment_instructions'] });
      setIsInstructionFormOpen(false);
      setEditingInstruction(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const contactMutation = useMutation({
    mutationFn: async (formData: ContactFormInputs) => {
      if (!session) throw new Error("Not authenticated");
      const action = editingContact ? 'update' : 'create';
      const id = editingContact ? editingContact.id : undefined;

      const { error } = await supabase.functions.invoke('crud-payment-instruction', {
        body: { action, type: 'contact', id, data: formData }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Proof contact ${editingContact ? 'updated' : 'created'}.`);
      queryClient.invalidateQueries({ queryKey: ['proof_contacts'] });
      setIsContactFormOpen(false);
      setEditingContact(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteInstructionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.functions.invoke('crud-payment-instruction', {
        body: { action: 'delete', type: 'instruction', id }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Method deleted.');
      queryClient.invalidateQueries({ queryKey: ['payment_instructions'] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.functions.invoke('crud-payment-instruction', {
        body: { action: 'delete', type: 'contact', id }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Contact deleted.');
      queryClient.invalidateQueries({ queryKey: ['proof_contacts'] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      {isInstructionFormOpen && <InstructionForm instruction={editingInstruction} onFormSubmit={(data) => instructionMutation.mutate(data)} onCancel={() => { setIsInstructionFormOpen(false); setEditingInstruction(null); }} />}
      {isContactFormOpen && <ContactForm contact={editingContact} onFormSubmit={(data) => contactMutation.mutate(data)} onCancel={() => { setIsContactFormOpen(false); setEditingContact(null); }} />}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <button onClick={() => { setEditingInstruction(null); setIsInstructionFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Add Method</button>
        </div>

        {/* Search for Instructions */}
        <form onSubmit={handleInstructionSearch} className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search payment methods..."
            value={instructionSearchTerm}
            onChange={(e) => setInstructionSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover font-semibold">
            Search
          </button>
        </form>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full responsive-table">
            <thead><tr><th className="p-4 text-left font-semibold">Method Name</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
            <tbody>{isLoadingInstructions ? <tr><td colSpan={3}>Loading...</td></tr> : instructions?.map((instr: any) => (<tr key={instr.id}><td data-label="Name">{instr.method_name}</td><td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${instr.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200'}`}>{instr.is_active ? 'Active' : 'Inactive'}</span></td><td data-label="Actions" className="text-right space-x-2"><button onClick={() => { setEditingInstruction(instr); setIsInstructionFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteInstructionMutation.mutate(instr.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700">Delete</button></td></tr>))}</tbody>
          </table>
        </div>

        {/* Pagination for Instructions */}
        {instructionsPagination && instructionsPagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handleInstructionPageChange(currentInstructionPage - 1)}
              disabled={!instructionsPagination.hasPrev}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {instructionsPagination.page} of {instructionsPagination.totalPages} ({instructionsPagination.total} total)
            </span>

            <button
              onClick={() => handleInstructionPageChange(currentInstructionPage + 1)}
              disabled={!instructionsPagination.hasNext}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Proof of Payment Contacts</h2>
          <button onClick={() => { setEditingContact(null); setIsContactFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Add Contact</button>
        </div>

        {/* Search for Contacts */}
        <form onSubmit={handleContactSearch} className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search contacts..."
            value={contactSearchTerm}
            onChange={(e) => setContactSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover font-semibold">
            Search
          </button>
        </form>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full responsive-table">
            <thead><tr><th className="p-4 text-left font-semibold">Platform</th><th className="p-4 text-left font-semibold">Contact Info</th><th className="p-4 text-left font-semibold">Order</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
            <tbody>{isLoadingContacts ? <tr><td colSpan={5}>Loading...</td></tr> : contacts?.map((c: any) => (<tr key={c.id}><td data-label="Platform" className="capitalize">{c.platform}</td><td data-label="Contact">{c.contact_info}</td><td data-label="Order">{c.display_order}</td><td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td><td data-label="Actions" className="text-right space-x-2"><button onClick={() => { setEditingContact(c); setIsContactFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteContactMutation.mutate(c.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700">Delete</button></td></tr>))}</tbody>
          </table>
        </div>

        {/* Pagination for Contacts */}
        {contactsPagination && contactsPagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handleContactPageChange(currentContactPage - 1)}
              disabled={!contactsPagination.hasPrev}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {contactsPagination.page} of {contactsPagination.totalPages} ({contactsPagination.total} total)
            </span>

            <button
              onClick={() => handleContactPageChange(currentContactPage + 1)}
              disabled={!contactsPagination.hasNext}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};