import React from 'react';
import { ReleaseFormat } from '../types';
import { Label, Checkbox, Slider, Button, Badge } from '@/shared/components';
import { Disc, Music, CassetteTape, Filter, RotateCcw } from 'lucide-react';
import { useProductFilters } from '../hooks/useProductFilters';

export function FilterBar() {
  const {
    selectedFormat,
    selectedGenre,
    minPrice,
    maxPrice,
    updateFilters,
    clearFilters
  } = useProductFilters();

  return (
    <div className="w-full lg:w-64 space-y-8 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 backdrop-blur-sm sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-500" />
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-xs text-neutral-400 hover:text-white"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Format Filter */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-neutral-300">Format</Label>
        <div className="space-y-2">
          {[
            { id: ReleaseFormat.Vinyl.toString(), label: 'Vinyl', icon: <Disc className="h-4 w-4" /> },
            { id: ReleaseFormat.CD.toString(), label: 'CD', icon: <Music className="h-4 w-4" /> },
            { id: ReleaseFormat.Cassette.toString(), label: 'Cassette', icon: <CassetteTape className="h-4 w-4" /> },
          ].map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer ${selectedFormat === item.id ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-neutral-800'}`}
              onClick={() => updateFilters('format', selectedFormat === item.id ? null : item.id)}
            >
              <Checkbox
                id={`format-${item.id}`}
                checked={selectedFormat === item.id}
                onCheckedChange={() => updateFilters('format', selectedFormat === item.id ? null : item.id)}
              />
              <span className="flex items-center gap-2 text-sm font-medium">
                {item.icon}
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold text-neutral-300">Price Range</Label>
          <span className="text-xs font-mono text-blue-400">${minPrice} - ${maxPrice}</span>
        </div>
        <Slider
          defaultValue={[parseInt(minPrice), parseInt(maxPrice)]}
          max={500}
          step={10}
          onValueCommit={(values) => {
            updateFilters('minPrice', values[0].toString());
            updateFilters('maxPrice', values[1].toString());
          }}
          className="cursor-pointer"
        />
      </div>

      {/* Static Genres (Ideally from API) */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-neutral-300">Popular Genres</Label>
        <div className="flex flex-wrap gap-2">
          {['Rock', 'Jazz', 'Classical', 'Electronic', 'Pop', 'Hip Hop'].map((genre) => (
            <Badge
              key={genre}
              variant={selectedGenre === genre ? 'default' : 'outline'}
              className={`cursor-pointer px-3 py-1 transition-all ${selectedGenre === genre ? 'bg-blue-600' : 'hover:border-blue-500 hover:text-blue-400'}`}
              onClick={() => updateFilters('genre', selectedGenre === genre ? null : genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};



