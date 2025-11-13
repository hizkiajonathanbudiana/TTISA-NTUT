import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    maxVisiblePages = 5
}) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let start = Math.max(1, currentPage - halfVisible);
        let end = Math.min(totalPages, currentPage + halfVisible);

        // Adjust if we're near the beginning or end
        if (end - start + 1 < maxVisiblePages) {
            if (start === 1) {
                end = Math.min(totalPages, start + maxVisiblePages - 1);
            } else {
                start = Math.max(1, end - maxVisiblePages + 1);
            }
        }

        // Add first page and ellipsis if needed
        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        // Add visible page numbers
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex justify-center items-center space-x-1 mt-6">
            {/* First page button */}
            {showFirstLast && currentPage > 1 && (
                <button
                    onClick={() => onPageChange(1)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    title="First page"
                >
                    ««
                </button>
            )}

            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>

            {/* Page numbers */}
            {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page as number)}
                            className={`px-3 py-2 text-sm border rounded-md ${currentPage === page
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>

            {/* Last page button */}
            {showFirstLast && currentPage < totalPages && (
                <button
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    title="Last page"
                >
                    »»
                </button>
            )}
        </div>
    );
};