import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ChennaiMap from '../components/ChennaiMap';
import { featuredRestaurants } from '../data/restaurants';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (location) => {
    navigate('/restaurants');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Discover Chennai's Best Restaurants</h1>
            <p className="text-xl mb-8">Find top-rated places to eat based on millions of reviews</p>
            <SearchBar
              onSearch={handleSearch}
              className="max-w-xl mx-auto"
              inputClassName="bg-pink-700 text-white" // Added dark pink color
              buttonClassName="bg-pink-700 hover:bg-pink-800" // Added dark pink color
            />
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Restaurants</h2>
            <button onClick={() => navigate('/restaurants')} className="text-blue-500">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-xl shadow-md">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{restaurant.name}</h3>
                  <p>{restaurant.cuisine}</p>
                  <p>{restaurant.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Explore Chennai's Culinary Map</h2>
              <p className="mb-6">
                From the bustling streets of T. Nagar to the serene beaches of East Coast Road, Chennai offers a diverse range of culinary experiences.
              </p>
              <button
                onClick={() => navigate('/restaurants')}
                className="px-6 py-3 bg-pink-700 text-white rounded hover:bg-pink-800" // Added dark pink color
              >
                Find Restaurants Near You
              </button>
            </div>
            <ChennaiMap className="h-96" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;