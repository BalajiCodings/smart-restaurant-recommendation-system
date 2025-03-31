import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-black pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TastyTrack</h3>
            <p className="mb-4">
              Discover the best restaurants in Chennai with TastyTrack. Find top-rated places to eat based on genuine reviews.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-200 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-200 transition-colors">Home</Link></li>
              <li><Link to="/restaurants" className="hover:text-gray-200 transition-colors">Restaurants</Link></li>
              <li><Link to="/about" className="hover:text-gray-200 transition-colors">About Us</Link></li>
              <li><a href="mailto:bala22003.cb@rmkec.ac.in" className="hover:text-gray-200 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Popular Cuisines</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-200 transition-colors">South Indian</a></li>
              <li><a href="#" className="hover:text-gray-200 transition-colors">North Indian</a></li>
              <li><a href="#" className="hover:text-gray-200 transition-colors">Chinese</a></li>
              <li><a href="#" className="hover:text-gray-200 transition-colors">Italian</a></li>
              <li><a href="#" className="hover:text-gray-200 transition-colors">Continental</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>8/3 Ayyampet Thanjavur 614201</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0" />
                <span>+91 7418472778</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0" />
                <span>tastytrack@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-10 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} TastyTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;