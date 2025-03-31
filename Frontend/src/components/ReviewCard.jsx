import React from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const { userName, rating, date, comment, userImage } = review;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
          fill={i <= rating ? '#FBBF24' : 'none'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start">
        <img
          src={userImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800">{userName}</h4>
              <div className="flex items-center mt-1">
                <div className="flex mr-2">{renderStars()}</div>
                <span className="text-sm text-gray-500">{date}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-gray-700">{comment}</p>
          <div className="flex items-center mt-3 space-x-4">
            <button className="flex items-center text-sm text-gray-500 hover:text-violet-600 transition-colors">
              <ThumbsUp size={14} className="mr-1" />
              <span>Helpful</span>
            </button>
            <button className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors">
              <Flag size={14} className="mr-1" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;