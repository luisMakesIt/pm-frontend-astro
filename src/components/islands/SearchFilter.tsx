import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  filters?: { key: string; label: string; options: { value: string; label: string }[] }[];
  placeholder?: string;
  className?: string;
}

export default function SearchFilter({
  onSearch,
  onFilter,
  filters = [],
  placeholder = 'Buscar...',
  className = '',
}: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setQuery('');
    onSearch?.('');
    onFilter?.({});
  };

  const filterCount = Object.keys(activeFilters).length;

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>

        {/* Filter toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-sm ${showFilters ? 'bg-primary text-white' : 'btn-secondary'}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {filterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>

          {filterCount > 0 && (
            <button onClick={clearFilters} className="btn btn-sm btn-ghost text-red-500 hover:text-red-600">
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          {filters.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay filtros disponibles</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filters.map(filter => (
                <div key={filter.key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {filter.label}
                  </label>
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={e => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Todos</option>
                    {filter.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
