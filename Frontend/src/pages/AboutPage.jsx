import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-pink-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <img
          src="balaji.jpg"
          alt="Owner"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">Balaji</h1>
        <p className="text-gray-700 mb-4">Owner of TastyTrack</p>
        <p className="text-gray-600 mb-4">
          Passionate about helping people discover the best dining experiences in Chennai. With years of experience in the food industry, I aim to make TastyTrack the go-to platform for restaurant recommendations.
        </p>
        <p className="text-gray-600">
          <strong>Phone:</strong> +91 7418472778
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
