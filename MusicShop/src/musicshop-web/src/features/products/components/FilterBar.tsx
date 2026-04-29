import React from 'react';
import { ReleaseFormat } from '../types';
import { Label, Checkbox, Button, Badge, Skeleton } from '@/shared/components';
import { Disc, Music, CassetteTape, Filter, RotateCcw } from 'lucide-react';
import { useProductFilters } from '../hooks/useProductFilters';
import { useGenres } from '@/features/catalog/hooks/useGenres';

export function FilterBar() {
  const {
    selectedFormat,
    selectedGenre,
    updateFilters,
    clearFilters
  } = useProductFilters();

  const { data: genresData, isLoading: loadingGenres } = useGenres();
  const genres = genresData?.items || [];

  return (
    <div className="w-full lg:w-64 space-y-8 bg-surface p-6 rounded-2xl border border-border shadow-sm sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-xs text-subtle hover:text-foreground hover:bg-muted"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Format Filter */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-muted-foreground">Format</Label>
        <div className="space-y-2">
          {[
            { id: ReleaseFormat.Vinyl.toString(), label: 'Vinyl', icon: <Disc className="h-4 w-4" /> },
            { id: ReleaseFormat.CD.toString(), label: 'CD', icon: <Music className="h-4 w-4" /> },
            { id: ReleaseFormat.Cassette.toString(), label: 'Cassette', icon: <CassetteTape className="h-4 w-4" /> },
          ].map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer ${selectedFormat === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              onClick={() => updateFilters('format', selectedFormat === item.id ? null : item.id)}
            >
              <Checkbox
                id={`format-${item.id}`}
                checked={selectedFormat === item.id}
                onCheckedChange={() => updateFilters('format', selectedFormat === item.id ? null : item.id)}
              />
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                {item.icon}
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>


      {/* Dynamic Genres */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-muted-foreground">Popular Genres</Label>
        <div className="flex flex-wrap gap-2">
          {loadingGenres ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full bg-muted" />
            ))
          ) : (
            genres.map((genre) => (
              <Badge
                key={genre.id}
                variant={selectedGenre === genre.slug ? 'default' : 'outline'}
                className={`cursor-pointer px-3 py-1 transition-all ${selectedGenre === genre.slug ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                onClick={() => updateFilters('genre', selectedGenre === genre.slug ? null : genre.slug)}
              >
                {genre.name}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
