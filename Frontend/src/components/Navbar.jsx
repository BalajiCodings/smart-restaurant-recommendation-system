import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-pink-500 text-black shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Utensils className="h-8 w-8" />
          <span className="text-2xl font-bold">TastyTrack</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-pink-700 transition-colors">Home</Link>
            <Link to="/restaurants" className="hover:text-pink-700 transition-colors">Restaurants</Link>
            <Link to="/login" className="hover:text-pink-700 transition-colors">Sign In</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;