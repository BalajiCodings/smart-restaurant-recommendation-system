import React from 'react';

const ChennaiMap = ({ className = "" }) => {
  const mapImageUrl = "/public/chennai-map.jpg"; // Ensure this image exists in the public/assets folder

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}>
      <img 
        src={mapImageUrl} 
        alt="Chennai Map" 
        className="w-full h-full object-cover"
      />
      <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-pink-500 w-4 h-4 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-violet-600 w-4 h-4 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-pink-500 w-4 h-4 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-lg font-bold">Explore Chennai's Best Restaurants</h3>
        <p className="text-sm">Discover top-rated dining spots across the city</p>
      </div>
    </div>
  );
};

export default ChennaiMap;