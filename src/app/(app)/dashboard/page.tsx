
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemCard } from "@/components/item-card"
import { CategoryScroller } from "@/components/category-scroller"
import { useFirestore, useMemoFirebase, useUser, useDoc, useCollection } from '@/firebase';
import { collection, query, where, orderBy, endAt, startAt, limit, doc, Timestamp } from 'firebase/firestore';
import type { Item, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { ChevronRight, Package, Gift, Star } from 'lucide-react';
import Image from 'next/image';


// --- Mock Data ---
const sampleItems: Item[] = [
    {
      id: 'item-1',
      title: "Sony Noise-Cancelling Headphones",
      description: "WH-1000XM4 model. Excellent condition, comes with the original case. The sound quality is amazing.",
      category: "Audio Devices",
      condition: "Used - Like New",
      listingType: "Sell",
      price: 8000,
      imageUrls: ["https://images.unsplash.com/photo-1546435770-a3e426bf40B1?q=80&w=800&auto=format&fit=crop"],
      locality: "Baner",
      ownerId: "user_02",
      ownerName: "Anjali Sharma",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
      ownerRating: 4.9,
      status: "Available",
      isFeatured: true,
      postedAt: Timestamp.fromDate(new Date()),
    },
    {
      id: 'item-2',
      title: "Dell XPS 13 Laptop (2020 Model)",
      description: "Good condition, works perfectly for coding and daily use. Has a few minor scratches on the lid. Comes with original charger.",
      category: "Laptops",
      condition: "Used - Good",
      listingType: "Sell",
      price: 35000,
      imageUrls: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop"],
      locality: "Kothrud",
      ownerId: "user_01",
      ownerName: "Rohan Kumar",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=rohan",
      ownerRating: 4.8,
      status: "Available",
      isFeatured: false,
      postedAt: Timestamp.fromDate(new Date()),
    },
    {
      id: 'item-3',
      title: "Apple iPhone X - For Donation",
      description: "Screen has a crack in the corner but is fully functional. Battery health is at 75%. Good for a spare phone or parts. Giving it away for free.",
      category: "Mobiles",
      condition: "Needs Minor Repair",
      listingType: "Donate",
      price: 0,
      imageUrls: ["https://images.unsplash.com/photo-1592224907029-2b5e03a088a2?q=80&w=800&auto=format&fit=crop"],
      locality: "Viman Nagar",
      ownerId: "user_02",
      ownerName: "Anjali Sharma",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
      ownerRating: 4.9,
      status: "Available",
      isFeatured: true,
      postedAt: Timestamp.fromDate(new Date()),
    },
    {
      id: 'item-4',
      title: "Logitech Mechanical Gaming Keyboard",
      description: "RGB backlit mechanical keyboard. All keys and lights working perfectly. Great for gaming and typing.",
      category: "Keyboards & Mice",
      condition: "Used - Like New",
      listingType: "Sell",
      price: 2500,
      imageUrls: ["https://images.unsplash.com/photo-1618384887924-2f80214156b2?q=80&w=800&auto=format&fit=crop"],
      locality: "Hadapsar",
      ownerId: "user_03",
      ownerName: "Vikram Singh",
      ownerAvatarUrl: null,
      ownerRating: 4.5,
      status: "Available",
      isFeatured: false,
      postedAt: Timestamp.fromDate(new Date()),
    },
    {
      id: 'item-5',
      title: "Samsung 24-inch Monitor (for parts)",
      description: "The monitor does not turn on. Might be an issue with the power supply. The screen panel itself is not cracked. Good for someone who can repair it or use it for spare parts.",
      category: "Monitors",
      condition: "For Spare Parts",
      listingType: "Donate",
      price: 0,
      imageUrls: ["https://images.unsplash.com/photo-1586221434133-28b3a03358c5?q=80&w=800&auto=format&fit=crop"],
      locality: "Viman Nagar",
      ownerId: "user_02",
      ownerName: "Anjali Sharma",
      ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
      ownerRating: 4.9,
      status: "Available",
      isFeatured: false,
      postedAt: Timestamp.fromDate(new Date()),
    },
];
// --- End Mock Data ---


interface DashboardPageProps {
  selectedLocality?: string;
  searchText?: string;
}

const ItemCarousel = ({ title, items, icon, viewAllHref, userWishlist }: { title: string, items: Item[], icon: React.ElementType, viewAllHref: string, userWishlist: string[] }) => {
  const Icon = icon;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-headline text-2xl font-bold">
          <Icon className="h-6 w-6" />
          {title}
        </h2>
        <Button variant="link" asChild>
          <Link href={viewAllHref}>See All <ChevronRight className="h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {items.map(item => (
            <div key={item.id} className="w-full min-w-[280px] sm:min-w-[300px] snap-start">
              <ItemCard item={item} userWishlist={userWishlist} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function DashboardPage({ selectedLocality, searchText = "" }: DashboardPageProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const firestore = useFirestore();
  const { user: authUser } = useUser();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, "users", authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile } = useDoc<User>(userRef);
  const userWishlist = userProfile?.wishlist || [];

  // --- MOCK DATA IMPLEMENTATION ---
  const [isLoading, setIsLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [donationItems, setDonationItems] = useState<Item[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<Item[]>([]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      let filteredItems = sampleItems;

      if(selectedLocality) {
          filteredItems = sampleItems.filter(item => item.locality === selectedLocality);
      }

      if (activeCategory !== 'All') {
        filteredItems = filteredItems.filter(item => item.category === activeCategory);
      }

      if (searchText && searchText.length >= 3) {
          filteredItems = filteredItems.filter(item =>
              item.title.toLowerCase().includes(searchText.toLowerCase())
          );
      }
      
      setFeaturedItems(sampleItems.filter(item => item.isFeatured && (selectedLocality ? item.locality === selectedLocality : true)));
      setDonationItems(sampleItems.filter(item => item.listingType === 'Donate' && (selectedLocality ? item.locality === selectedLocality : true)));
      setRecommendedItems(filteredItems);
      setIsLoading(false);
    }, 500);

  }, [selectedLocality, activeCategory, searchText]);
  // --- END MOCK DATA IMPLEMENTATION ---

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };
  
  if (isLoading) {
    // Keep skeleton for loading state
  }


  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative aspect-[2/1] md:aspect-[3/1] w-full overflow-hidden rounded-xl bg-secondary">
          <Image
              src="https://images.unsplash.com/photo-1598257006624-98c4e36480a6?q=80&w=2070&auto=format&fit=crop"
              alt="E-waste recycling"
              fill
              className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-md">
                  Give Your Electronics a Second Life
              </h1>
              <p className="max-w-2xl mt-2 text-sm sm:text-base md:text-lg drop-shadow-sm">
                  Join the Pune community in reducing e-waste. Buy, sell, or donate your used gadgets today.
              </p>
              <Button asChild size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/post">Post Your Gadget Now</Link>
              </Button>
          </div>
      </div>

      {/* Category Scroller */}
      <div className='space-y-2'>
        <h2 className="font-headline text-2xl font-bold">Browse by Category</h2>
        <CategoryScroller activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      </div>

      {isLoading ? (
        <div className="space-y-8">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full min-w-[280px]" />)}
              </div>
            </div>
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
              </div>
            </div>
        </div>
      ) : (
        <>
          {featuredItems && featuredItems.length > 0 && activeCategory === 'All' && searchText.length < 3 && (
            <ItemCarousel 
              title="Featured Gadgets" 
              items={featuredItems} 
              icon={Star}
              viewAllHref="#"
              userWishlist={userWishlist}
            />
          )}

          {donationItems && donationItems.length > 0 && activeCategory === 'All' && searchText.length < 3 && (
            <ItemCarousel 
              title="Donations Corner"
              items={donationItems}
              icon={Gift}
              viewAllHref="#"
              userWishlist={userWishlist}
            />
          )}

          <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold">Fresh Recommendations</h2>
            {recommendedItems && recommendedItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendedItems.map((item) => (
                    <ItemCard key={item.id} item={item} userWishlist={userWishlist} />
                ))}
                </div>
            ) : (
                <EmptyState
                    icon={Package}
                    title="No Listings Found"
                    description={`There are currently no electronic listings matching your criteria. Try another category or search term!`}
                />
            )}
          </div>
        </>
      )}
    </div>
  )
}

    