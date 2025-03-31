import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ onFilterChange, activeFilters }) => {
  const cuisines = [
    'All Cuisines',
    'South Indian',
    'North Indian',
    'Chinese',
    'Italian',
    'Continental',
    'Street Food',
    'Seafood',
    'Desserts'
  ];

  return (
    <div className="bg-pink-100 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <SlidersHorizontal size={20} className="text-violet-600 mr-2" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sort"
              value={activeFilters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="rating">Highest Rating</option>
              <option value="reviews">Most Reviewed</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
            <select
              id="cuisine"
              value={activeFilters.cuisine}
              onChange={(e) => onFilterChange('cuisine', e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine === 'All Cuisines' ? '' : cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;