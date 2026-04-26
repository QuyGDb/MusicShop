import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/shared/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Simple range generation
  // For more complex ones we could use a utility like '1, 2, ..., 10'
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center justify-center gap-2 pt-8", className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-xl bg-surface border-border hover:bg-muted"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <Button
            key={p}
            variant={currentPage === p ? "default" : "outline"}
            className={cn(
              "h-10 w-10 rounded-xl transition-all font-bold",
              currentPage === p 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                : "bg-surface border-border hover:bg-muted"
            )}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-xl bg-surface border-border hover:bg-muted"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
