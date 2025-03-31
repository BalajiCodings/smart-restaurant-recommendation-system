import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ sort: 'rating', cuisine: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurants?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data.restaurants);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Unable to load restaurants. Please try again later.');
      }
    };

    fetchRestaurants();
  }, [page]);

  useEffect(() => {
    let result = [...restaurants];

    if (activeFilters.cuisine) {
      result = result.filter((restaurant) =>
        restaurant.cuisine.toLowerCase().includes(activeFilters.cuisine.toLowerCase())
      );
    }

    if (searchQuery) {
      result = result.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (activeFilters.sort === 'rating') {
        return b.rating - a.rating;
      } else if (activeFilters.sort === 'reviews') {
        return b.reviewCount - a.reviewCount;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    setFilteredRestaurants(result);
  }, [restaurants, activeFilters, searchQuery]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Restaurants in Chennai</h1>
          <SearchBar onSearch={handleSearch} placeholder="Search by name, location, or cuisine..." />
        </div>

        <FilterBar onFilterChange={handleFilterChange} activeFilters={activeFilters} />

        {error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <button
            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantListPage;
