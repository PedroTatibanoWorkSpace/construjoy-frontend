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
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <PaginationRoot className="flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={currentPage === 1 ? undefined : handlePrevPage}
            className={`${
              currentPage === 1
                ? "opacity-50 pointer-events-none"
                : "bg-gray-700 text-white hover:bg-gray-800"
            } transition-colors rounded-l-lg px-3 py-2`}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem key={page}>
              <Button
                variant={currentPage === page ? "default" : "outline"}
                className={`${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                } transition-colors px-3 py-2`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            onClick={currentPage === totalPages ? undefined : handleNextPage}
            className={`${
              currentPage === totalPages
                ? "opacity-50 pointer-events-none"
                : "bg-gray-700 text-white hover:bg-gray-800"
            } transition-colors rounded-r-lg px-3 py-2`}
          >
            Próxima
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
