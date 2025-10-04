
'use client';

import { ItemCard } from "@/components/item-card"
import { EmptyState } from "@/components/empty-state"
import { Heart } from "lucide-react"
import { useUser } from "@/firebase";
import type { Item } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Timestamp } from 'firebase/firestore';
import { useState } from "react";

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
    postedAt: new Timestamp(1672531200, 0),
  },
  {
    id: "item-2",
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
    postedAt: new Timestamp(1672617600, 0),
  },
  {
    id: "item-3",
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
    postedAt: new Timestamp(1672704000, 0),
  },
];


export default function WishlistPage() {
  const { user } = useUser();
  // Using mock data for now.
  const [wishlistedItems, setWishlistedItems] = useState(mockWishlistedItems);
  const [isLoading, setIsLoading] = useState(false);


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
