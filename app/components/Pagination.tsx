import React from "react";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StandardPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  // Show max 5 page buttons with ellipsis logic
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <PaginationRoot className="flex justify-end">
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={currentPage === 1 ? undefined : handlePrevPage}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              currentPage === 1
                ? "opacity-40 pointer-events-none text-gray-500"
                : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>

        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 rounded-lg text-sm transition-all ${
                currentPage === page
                  ? "bg-blue-600 text-white hover:bg-blue-600 shadow-md shadow-blue-600/20"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={currentPage === totalPages ? undefined : handleNextPage}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              currentPage === totalPages
                ? "opacity-40 pointer-events-none text-gray-500"
                : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Próxima
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
