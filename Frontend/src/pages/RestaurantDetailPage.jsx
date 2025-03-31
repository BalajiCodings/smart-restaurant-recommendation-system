import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { allRestaurants } from '../data/restaurants';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const foundRestaurant = allRestaurants.find((r) => r.id === id);
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      setReviews(foundRestaurant.reviews || []);
    }
  }, [id]);

  const handleReviewSubmit = (newReview) => {
    const review = {
      id: `review-${Date.now()}`,
      userName: 'You',
      rating: newReview.rating,
      date: new Date().toLocaleDateString(),
      comment: newReview.comment,
    };
    setReviews((prev) => [review, ...prev]);
    alert('Thank you for your review!');
  };

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Loading restaurant details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Restaurant Header */}
      <div className="relative h-80 bg-gray-900">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link to="/restaurants" className="inline-flex items-center text-white mb-4 hover:text-pink-300 transition-colors">
              Back to Restaurants
            </Link>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;