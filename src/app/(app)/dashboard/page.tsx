
'use client';

import React, { useState } from 'react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, endAt, startAt, limit } from 'firebase/firestore';
import type { Item } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { ChevronRight, Package, Gift, Star } from 'lucide-react';
import Image from 'next/image';

interface DashboardPageProps {
  selectedLocality?: string;
  searchText?: string;
}

const ItemCarousel = ({ title, items, icon, viewAllHref }: { title: string, items: Item[], icon: React.ElementType, viewAllHref: string }) => {
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
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function DashboardPage({ selectedLocality, searchText }: DashboardPageProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const firestore = useFirestore();
  const effectiveSearchText = searchText && searchText.length >= 3 ? searchText : '';


  const baseQuery = useMemoFirebase(() => {
    if (!firestore || !selectedLocality) return null;
    return query(
      collection(firestore, "items"),
      where("locality", "==", selectedLocality)
    );
  }, [firestore, selectedLocality]);

  const featuredQuery = useMemoFirebase(() => {
    if (!baseQuery) return null;
    return query(baseQuery, where("isFeatured", "==", true), limit(10));
  }, [baseQuery]);

  const donationsQuery = useMemoFirebase(() => {
    if (!baseQuery) return null;
    return query(baseQuery, where("listingType", "==", "Donate"), limit(10));
  }, [baseQuery]);
  
  const recommendationsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedLocality) return null;

    const baseCollection = collection(firestore, 'items');
    const queryConstraints = [where('locality', '==', selectedLocality)];

    // Category filter
    if (activeCategory !== 'all') {
      queryConstraints.push(where('category', '==', activeCategory));
    }

    // Search text filter
    if (effectiveSearchText) {
      const capitalizedSearchText = effectiveSearchText.charAt(0).toUpperCase() + effectiveSearchText.slice(1);
      queryConstraints.push(orderBy('title'));
      queryConstraints.push(startAt(capitalizedSearchText));
      queryConstraints.push(endAt(capitalizedSearchText + '\uf8ff'));
    } else {
      // Default sort order when not searching
      queryConstraints.push(orderBy('postedAt', 'desc'));
    }
    
    return query(baseCollection, ...queryConstraints);

  }, [firestore, selectedLocality, activeCategory, effectiveSearchText]);

  const { data: featuredItems, isLoading: areFeaturedLoading } = useCollection<Item>(featuredQuery);
  const { data: donationItems, isLoading: areDonationsLoading } = useCollection<Item>(donationsQuery);
  const { data: recommendedItems, isLoading: areRecommendationsLoading } = useCollection<Item>(recommendationsQuery);


  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const isLoading = areFeaturedLoading || areDonationsLoading || areRecommendationsLoading || !selectedLocality;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative aspect-[2/1] md:aspect-[3/1] w-full overflow-hidden rounded-xl bg-secondary">
          <Image
              src="https://images.unsplash.com/photo-1624555139947-66a87c027ea5?q=80&w=2070&auto=format&fit=crop"
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
                <Link href="/post">Post Your Item Now</Link>
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
          {featuredItems && featuredItems.length > 0 && (
            <ItemCarousel 
              title="Featured Items" 
              items={featuredItems} 
              icon={Star}
              viewAllHref="#"
            />
          )}

          {donationItems && donationItems.length > 0 && (
            <ItemCarousel 
              title="Donations Corner"
              items={donationItems}
              icon={Gift}
              viewAllHref="#"
            />
          )}

          <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold">Fresh Recommendations</h2>
            {recommendedItems && recommendedItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendedItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
                </div>
            ) : (
                <EmptyState
                    icon={Package}
                    title="No Listings Found"
                    description={`There are currently no listings matching your criteria in ${selectedLocality}. Try another category or search term!`}
                />
            )}
          </div>
        </>
      )}
    </div>
  )
}

    