// Sample reviews
const sampleReviews = [
  {
    id: 'review-1',
    userName: 'Priya Sharma',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Absolutely loved the food here! The dosas were crispy and the sambhar was flavorful. The service was quick and the staff was very friendly. Will definitely come back!',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'review-2',
    userName: 'Rahul Mehta',
    rating: 4,
    date: '1 month ago',
    comment: 'Great ambiance and delicious food. The biryani was authentic and flavorful. Only reason for 4 stars is that the place was a bit crowded and we had to wait for 20 minutes.',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'review-3',
    userName: 'Ananya Patel',
    rating: 5,
    date: '2 months ago',
    comment: 'One of the best restaurants in Chennai! The paneer butter masala was creamy and delicious. The naan was soft and buttery. Highly recommend this place for North Indian cuisine.',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'review-4',
    userName: 'Vikram Singh',
    rating: 3,
    date: '3 months ago',
    comment: 'The food was good but not exceptional. The prices are a bit on the higher side for the quantity served. The ambiance is nice though.',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
  }
];

// Featured restaurants (shown on homepage)
export const featuredRestaurants = [
  {
    id: 'rest-1',
    name: 'Saravana Bhavan',
    cuisine: 'South Indian',
    rating: 4.8,
    reviewCount: 1245,
    address: 'T. Nagar, Chennai',
    image: 'https://b.zmtcdn.com/data/pictures/6/19850586/544f53757b41ba687cc554a7a4fcf9e7.jpg',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-2',
    name: 'Bombay Brasserie',
    cuisine: 'North Indian',
    rating: 4.6,
    reviewCount: 876,
    address: 'Nungambakkam, Chennai',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-3',
    name: 'Mainland China',
    cuisine: 'Chinese',
    rating: 4.5,
    reviewCount: 654,
    address: 'Velachery, Chennai',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  }
];

// All restaurants (shown on restaurant list page)
export const allRestaurants = [
  ...featuredRestaurants,
  {
    id: 'rest-4',
    name: 'Murugan Idli Shop',
    cuisine: 'South Indian',
    rating: 4.7,
    reviewCount: 932,
    address: 'Besant Nagar, Chennai',
    image: 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-5',
    name: 'Pind Punjab',
    cuisine: 'North Indian',
    rating: 4.4,
    reviewCount: 567,
    address: 'Anna Nagar, Chennai',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-6',
    name: 'Italia',
    cuisine: 'Italian',
    rating: 4.6,
    reviewCount: 423,
    address: 'Adyar, Chennai',
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-7',
    name: 'Benjarong',
    cuisine: 'Thai',
    rating: 4.5,
    reviewCount: 345,
    address: 'Alwarpet, Chennai',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-8',
    name: 'Teppan',
    cuisine: 'Japanese',
    rating: 4.7,
    reviewCount: 289,
    address: 'Nungambakkam, Chennai',
    image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-9',
    name: 'Dindigul Thalappakatti',
    cuisine: 'Biryani',
    rating: 4.3,
    reviewCount: 876,
    address: 'T. Nagar, Chennai',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-10',
    name: 'Copper Chimney',
    cuisine: 'North Indian',
    rating: 4.5,
    reviewCount: 543,
    address: 'Phoenix Market City, Chennai',
    image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-11',
    name: 'Azzuri Bay',
    cuisine: 'Continental',
    rating: 4.6,
    reviewCount: 321,
    address: 'ECR, Chennai',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  },
  {
    id: 'rest-12',
    name: 'Buhari',
    cuisine: 'Mughlai',
    rating: 4.2,
    reviewCount: 765,
    address: 'Mount Road, Chennai',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    reviews: [...sampleReviews]
  }
];