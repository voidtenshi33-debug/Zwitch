
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
import { collection, query, where, orderBy, limit, doc, Query } from 'firebase/firestore';
import type { Item, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { ChevronRight, Package, Gift, Star } from 'lucide-react';
import Image from 'next/image';

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

  const baseItemsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'items');
  }, [firestore]);

  const filteredQuery = useMemoFirebase(() => {
      if (!baseItemsQuery) return null;

      let q: Query = query(baseItemsQuery, where('status', '==', 'Available'));

      if (selectedLocality) {
          q = query(q, where('locality', '==', selectedLocality));
      }

      if (activeCategory !== 'All') {
          q = query(q, where('category', '==', activeCategory));
      }
      
      // Full text search is complex with Firestore.
      // A simple `where` clause for partial matches isn't supported.
      // For a real app, a search service like Algolia or Typesense is recommended.
      // For this demo, we will filter on the client after fetching.
      
      return q;
  }, [baseItemsQuery, selectedLocality, activeCategory]);

  const { data: items, isLoading: areItemsLoading } = useCollection<Item>(filteredQuery);
  
  const recommendedItems = useMemo(() => {
      if (!items) return [];
      if (searchText && searchText.length >= 3) {
          return items.filter(item =>
              item.title.toLowerCase().includes(searchText.toLowerCase())
          );
      }
      return items;
  }, [items, searchText]);

  const featuredQuery = useMemoFirebase(() => {
      if (!baseItemsQuery) return null;
      let q: Query = query(baseItemsQuery, where('isFeatured', '==', true), where('status', '==', 'Available'), limit(5));
       if (selectedLocality) {
          q = query(q, where('locality', '==', selectedLocality));
      }
      return q;
  }, [baseItemsQuery, selectedLocality]);
  const { data: featuredItems, isLoading: areFeaturedLoading } = useCollection<Item>(featuredQuery);

  const donationQuery = useMemoFirebase(() => {
      if (!baseItemsQuery) return null;
      let q: Query = query(baseItemsQuery, where('listingType', '==', 'Donate'), where('status', '==', 'Available'), limit(5));
      if (selectedLocality) {
          q = query(q, where('locality', '==', selectedLocality));
      }
      return q;
  }, [baseItemsQuery, selectedLocality]);
  const { data: donationItems, isLoading: areDonationsLoading } = useCollection<Item>(donationQuery);
  
  const isLoading = areItemsLoading || areFeaturedLoading || areDonationsLoading;

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative aspect-[2/1] md:aspect-[3/1] w-full overflow-hidden rounded-xl bg-secondary">
          <Image
              src="https://images.unsplash.com/photo-1628260119619-2d37f1352945?q=80&w=2070&auto=format&fit=crop"
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

    