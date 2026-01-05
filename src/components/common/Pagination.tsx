// src/components/common/Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  className = '',
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftBoundary = Math.max(boundaryCount, 1);
    const rightBoundary = Math.max(totalPages - boundaryCount + 1, totalPages);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, leftBoundary);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, rightBoundary);

    const shouldShowLeftEllipsis = leftSiblingIndex > leftBoundary + 1;
    const shouldShowRightEllipsis = rightSiblingIndex < rightBoundary - 1;

    const pageNumbers: (number | string)[] = [];

    // Add boundary pages
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      pageNumbers.push(i);
    }

    // Add left ellipsis
    if (shouldShowLeftEllipsis) {
      pageNumbers.push('ellipsis-left');
    }

    // Add sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i > boundaryCount && i <= totalPages - boundaryCount) {
        pageNumbers.push(i);
      }
    }

    // Add right ellipsis
    if (shouldShowRightEllipsis) {
      pageNumbers.push('ellipsis-right');
    }

    // Add right boundary pages
    for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-between sm:justify-center space-x-2 ${className}`}
      aria-label="Pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${currentPage === 1
            ? 'border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* First page button */}
      {showFirstLast && currentPage > siblingCount + boundaryCount + 1 && (
        <button
          onClick={() => handlePageChange(1)}
          className={`
            hidden sm:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border
            border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors
          `}
          aria-label="Go to first page"
        >
          1
        </button>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-left' || page === 'ellipsis-right') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrent = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`
                flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border text-sm font-medium
                transition-colors min-w-8 sm:min-w-9
                ${isCurrent
                  ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }
              `}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - siblingCount - boundaryCount && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className={`
            hidden sm:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border
            border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors
          `}
          aria-label="Go to last page"
        >
          {totalPages}
        </button>
      )}

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${currentPage === totalPages
            ? 'border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;