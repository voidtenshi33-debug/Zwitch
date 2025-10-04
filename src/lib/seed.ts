
// IMPORTANT: This file is used to seed the database with sample data.
// It is designed to run only once.

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const sampleItems = [
    {
      title: "Dell XPS 13 Laptop (2020 Model)",
      description: "Good condition, works perfectly for coding and daily use. Has a few minor scratches on the lid. Comes with original charger.",
      category: "Laptops",
      condition: "Used - Good",
      listingType: "Sell",
      price: 35000,
      imageUrls: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
      locality: "Kothrud",
      ownerId: "user_01",
      ownerName: "Rohan Kumar",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=rohan",
      ownerRating: 4.8,
      status: "Available",
      isFeatured: false,
    },
    {
      title: "Apple iPhone X - For Donation",
      description: "Screen has a crack in the corner but is fully functional. Battery health is at 75%. Good for a spare phone or parts. Giving it away for free.",
      category: "Mobiles",
      condition: "Needs Minor Repair",
      listingType: "Donate",
      price: 0,
      imageUrls: ["https://images.unsplash.com/photo-1592224907029-2b5e03a088a2"],
      locality: "Viman Nagar",
      ownerId: "user_02",
      ownerName: "Anjali Sharma",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
      ownerRating: 4.9,
      status: "Available",
      isFeatured: true,
    },
    {
      title: "Logitech Mechanical Gaming Keyboard",
      description: "RGB backlit mechanical keyboard. All keys and lights working perfectly. Great for gaming and typing.",
      category: "Keyboards & Mice",
      condition: "Used - Like New",
      listingType: "Sell",
      price: 2500,
      imageUrls: ["https://images.unsplash.com/photo-1618384887924-2f80214156b2"],
      locality: "Hadapsar",
      ownerId: "user_03",
      ownerName: "Vikram Singh",
      ownerAvatarUrl: null,
      ownerRating: 4.5,
      status: "Available",
      isFeatured: false,
    },
    {
      title: "Samsung 24-inch Monitor (for parts)",
      description: "The monitor does not turn on. Might be an issue with the power supply. The screen panel itself is not cracked. Good for someone who can repair it or use it for spare parts.",
      category: "Monitors",
      condition: "For Spare Parts",
      listingType: "Donate",
      price: 0,
      imageUrls: ["https://images.unsplash.com/photo-1586221434133-28b3a03358c5"],
      locality: "Viman Nagar",
      ownerId: "user_02",
      ownerName: "Anjali Sharma",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
      ownerRating: 4.9,
      status: "Available",
      isFeatured: false,
    },
    {
      title: "Box of Assorted Cables and Chargers",
      description: "Includes various USB-A, Micro USB, and Aux cables. A few old phone chargers also included. All free for anyone who needs them.",
      category: "Chargers & Cables",
      condition: "Working",
      listingType: "Donate",
      price: 0,
      imageUrls: ["https://images.unsplash.com/photo-1585761994264-0a37397b9148"],
      locality: "Kothrud",
      ownerId: "user_01",
      ownerName: "Rohan Kumar",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=rohan",
      ownerRating: 4.8,
      status: "Available",
      isFeatured: false,
    },
    {
      title: "Sony Noise-Cancelling Headphones",
      description: "Excellent sound quality and noise cancellation. Perfect for travel or focused work. Comes with carrying case.",
      category: "Audio Devices",
      condition: "Used - Like New",
      listingType: "Sell",
      price: 8000,
      imageUrls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
      locality: "Baner",
      ownerId: "user_01",
      ownerName: "Rohan Kumar",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=rohan",
      ownerRating: 4.8,
      status: "Available",
      isFeatured: true,
    },
    {
        title: "Corsair Vengeance RAM 16GB",
        description: "2x8GB sticks of DDR4 RAM, running at 3200MHz. Great for upgrading a gaming PC or workstation.",
        category: "Components",
        condition: "Used - Good",
        listingType: "Sell",
        price: 3000,
        imageUrls: ["https://images.unsplash.com/photo-1591799264318-7e6e74e3cce2"],
        locality: "Hinjawadi",
        ownerId: "user_03",
        ownerName: "Vikram Singh",
        ownerAvatarUrl: null,
        ownerRating: 4.5,
        status: "Available",
        isFeatured: false
    }
];

export async function seedDatabase() {
  try {
    const itemsCollection = collection(db, 'items');
    const snapshot = await getDocs(itemsCollection);

    if (snapshot.empty) {
      console.log('No items found, seeding database...');
      const batch = writeBatch(db);
      sampleItems.forEach(item => {
        const docRef = collection(db, 'items').doc(); // Auto-generate ID
        batch.set(docRef, { ...item, postedAt: Timestamp.now() });
      });
      await batch.commit();
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already contains items, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
