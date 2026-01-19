import { ArrowUpDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PhotoGalleryFilter } from '@/types';

interface GalleryFiltersProps {
  filter: PhotoGalleryFilter;
  onFilterChange: (filter: Partial<PhotoGalleryFilter>) => void;
}

export function GalleryFilters({ filter, onFilterChange }: GalleryFiltersProps) {
  const sortOptions = [
    { value: 'date', label: 'По дате' },
    { value: 'likes', label: 'По лайкам' },
  ] as const;

  const handleSortChange = (sortBy: 'date' | 'likes') => {
    if (filter.sortBy === sortBy) {
      // Toggle order
      onFilterChange({
        sortOrder: filter.sortOrder === 'desc' ? 'asc' : 'desc',
      });
    } else {
      onFilterChange({ sortBy, sortOrder: 'desc' });
    }
  };

  const toggleTopOnly = () => {
    onFilterChange({ isTop: filter.isTop ? undefined : true });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">
              {sortOptions.find(o => o.value === filter.sortBy)?.label}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
              {filter.sortBy === option.value && (
                <span className="ml-2 text-muted-foreground">
                  {filter.sortOrder === 'desc' ? '↓' : '↑'}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Top filter */}
      <Button
        variant={filter.isTop ? 'default' : 'outline'}
        size="sm"
        className="gap-2"
        onClick={toggleTopOnly}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Только TOP</span>
      </Button>
    </div>
  );
}
