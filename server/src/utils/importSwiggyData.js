import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Restaurant } from '../models/Restaurant.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to parse offers
function parseOffers(offerString) {
  if (!offerString || offerString.trim() === '') return [];
  
  // Split by common delimiters and clean up
  const offers = offerString
    .split(/,(?=\s*[A-Z])|(?<=OFF)\s*(?=[A-Z])|(?<=₹\d+)\s*(?=[A-Z])/)
    .map(offer => offer.trim())
    .filter(offer => offer.length > 0);
  
  return offers;
}

// Helper function to clean and convert rating
function parseRating(ratingString) {
  if (!ratingString) return 0;
  const rating = parseFloat(ratingString);
  return isNaN(rating) ? 0 : rating;
}

// Helper function to parse price
function parsePrice(priceString) {
  if (!priceString) return '';
  return priceString.replace(/₹/g, '').trim();
}

// Helper function to parse number of offers
function parseNumberOfOffers(offerString) {
  if (!offerString || offerString.trim() === '') return 0;
  const offers = parseOffers(offerString);
  return offers.length;
}

// Generate a random Unsplash food image URL
function generateFoodImageUrl() {
  const foodKeywords = [
    'restaurant', 'food', 'indian-food', 'pizza', 'burger', 'pasta', 
    'chinese-food', 'italian-food', 'mexican-food', 'thai-food',
    'sushi', 'dessert', 'coffee', 'bakery', 'dining'
  ];
  
  const randomKeyword = foodKeywords[Math.floor(Math.random() * foodKeywords.length)];
  const randomId = Math.floor(Math.random() * 1000) + 1;
  
  return `https://source.unsplash.com/800x600/?${randomKeyword}&sig=${randomId}`;
}

export async function importSwiggyData() {
  try {
    console.log('🍽️  Starting Swiggy restaurant data import...');
    
    const csvFilePath = path.join(__dirname, '../../swiggy_file.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at: ${csvFilePath}`);
    }

    // Clear existing restaurants (optional - comment out to keep existing data)
    console.log('🗑️  Clearing existing restaurant data...');
    await Restaurant.deleteMany({});

    const restaurants = [];
    let processedCount = 0;
    const batchSize = 100; // Process in batches to avoid memory issues

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
          try {
            const restaurant = {
              name: row['Restaurant Name'] || '',
              cuisine: row['Cuisine'] || 'Mixed',
              rating: parseRating(row['Rating']),
              numberOfRatings: row['Number of Ratings'] || '0 ratings',
              averagePrice: parsePrice(row['Average Price']),
              numberOfOffers: parseNumberOfOffers(row['Offer Name']),
              offerNames: parseOffers(row['Offer Name']),
              area: row['Area'] || '',
              isPureVeg: row['Pure Veg'] === 'Yes',
              location: row['Location'] || '',
              address: `${row['Area'] || ''}, ${row['Location'] || ''}`.replace(/^,\s*|,\s*$/, ''),
              image: generateFoodImageUrl(),
              description: `Delicious ${row['Cuisine'] || 'food'} restaurant in ${row['Area'] || row['Location']}`,
              
              // Default coordinates (can be enhanced with geocoding later)
              coordinates: {
                type: 'Point',
                coordinates: [
                  77.5946 + (Math.random() - 0.5) * 0.1, // Random offset around Chennai
                  12.9716 + (Math.random() - 0.5) * 0.1
                ]
              }
            };

            restaurants.push(restaurant);
            processedCount++;

            // Process in batches
            if (restaurants.length >= batchSize) {
              processBatch(restaurants.splice(0, batchSize));
            }
          } catch (error) {
            console.warn(`⚠️  Error processing row ${processedCount + 1}:`, error.message);
          }
        })
        .on('end', async () => {
          try {
            // Process remaining restaurants
            if (restaurants.length > 0) {
              await processBatch(restaurants);
            }
            
            const totalCount = await Restaurant.countDocuments();
            console.log(`✅ Import completed! Total restaurants in database: ${totalCount}`);
            resolve(totalCount);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    async function processBatch(batch) {
      try {
        await Restaurant.insertMany(batch, { ordered: false });
        console.log(`📦 Processed batch of ${batch.length} restaurants. Total processed: ${processedCount}`);
      } catch (error) {
        // Handle duplicate key errors gracefully
        if (error.code === 11000) {
          console.warn(`⚠️  Some duplicate restaurants skipped in batch`);
        } else {
          throw error;
        }
      }
    }

  } catch (error) {
    console.error('❌ Error importing Swiggy data:', error);
    throw error;
  }
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasty-treat')
    .then(() => {
      console.log('📦 Connected to MongoDB');
      return importSwiggyData();
    })
    .then((count) => {
      console.log(`🎉 Successfully imported ${count} restaurants`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}
