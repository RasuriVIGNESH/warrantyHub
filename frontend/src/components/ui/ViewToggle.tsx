import React from 'react';
import { Button } from './Button';
import { LayoutGrid, List, SortAsc } from 'lucide-react';

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'date' | 'expiry' | 'price';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange
}: ViewToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          className="rounded-r-none border-0"
          onClick={() => onViewModeChange('grid')}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          className="rounded-l-none border-0 border-l border-gray-200 dark:border-gray-700"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4" />
          <span className="sr-only">List view</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
        >
          <option value="name">Name</option>
          <option value="date">Purchase Date</option>
          <option value="expiry">Warranty Expiry</option>
          <option value="price">Price</option>
        </select>
      </div>
    </div>
  );
} 