import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { debounce } from 'lodash';

export function DeviceSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search callback
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  // Update search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search devices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search className="h-5 w-5 text-gray-400" />}
        rightIcon={
          searchTerm ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null
        }
      />
    </div>
  );
}

DeviceSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
}; 