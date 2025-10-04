
'use client';

import { ItemCard } from "@/components/item-card"
import { EmptyState } from "@/components/empty-state"
import { Heart } from "lucide-react"
import { useUser } from "@/firebase";
import type { Item } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Timestamp } from 'firebase/firestore';
import { useState } from "react";

// Using mock data for now. This will be replaced with Firestore data.
const mockWishlistedItems: Item[] = [
  {
    id: "item-1",
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
    postedAt: Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "item-2",
    title: "Sony Noise-Cancelling Headphones",
    description: "WH-1000XM4 model. Excellent condition, comes with the original case. The sound quality is amazing.",
    category: "Audio Devices",
    condition: "Used - Like New",
    listingType: "Sell",
    price: 8000,
    imageUrls: ["https://images.unsplash.com/photo-1546435770-a3e426bf40B1"],
    locality: "Baner",
    ownerId: "user_02",
    ownerName: "Anjali Sharma",
    ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
    ownerRating: 4.9,
    status: "Available",
    isFeatured: true,
    postedAt: Timestamp.fromMillis(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];


export default function WishlistPage() {
  const { user } = useUser();
  // Using mock data for now. In a real implementation, you'd fetch this based on user.wishlist
  const [wishlistedItems, setWishlistedItems] = useState(mockWishlistedItems);
  const [isLoading, setIsLoading] = useState(false); // Set to true when fetching data


  return (
    <>
      <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
        My Wishlist
      </h1>
      {isLoading ? (
         <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
            ))}
        </div>
      ) : wishlistedItems && wishlistedItems.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any items yet. Start exploring and tap the heart icon on items you like!"
          ctaText="Explore Listings"
          ctaHref="/dashboard"
        />
      )}
    </>
  )
}
