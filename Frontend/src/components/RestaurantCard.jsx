import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const { id, name, image, cuisine, rating, reviewCount, address } = restaurant;

  return (
    <Link to={`/restaurant/${id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={`${image}?w=300&h=200&fit=crop`}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-semibold flex items-center shadow-md">
            <Star size={16} className="text-yellow-500 mr-1" fill="#FBBF24" />
            <span>{rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
          <p className="text-sm text-pink-600 mb-2">{cuisine}</p>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{reviewCount} reviews</span>
            <span className="text-sm font-medium text-violet-600 hover:text-pink-600 transition-colors">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
