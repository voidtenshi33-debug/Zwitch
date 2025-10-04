'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemCard } from "@/components/item-card"
import { CategoryScroller } from "@/components/category-scroller"
import { FilterPills } from '@/components/filter-pills';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Item } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Package } from 'lucide-react';

export default function DashboardPage({ selectedLocality }: { selectedLocality?: string }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const firestore = useFirestore();

  const itemsQuery = useMemoFirebase(() => {
    // Defer the query until both firestore and selectedLocality are available.
    if (!firestore || !selectedLocality) return null;

    const baseQuery = query(
      collection(firestore, "items"),
      where("locality", "==", selectedLocality),
      orderBy("postedAt", "desc")
    );

    if (activeCategory === 'all') {
      return baseQuery;
    } else {
      return query(baseQuery, where("category", "==", activeCategory));
    }
  }, [firestore, selectedLocality, activeCategory]);

  const { data: items, isLoading: areItemsLoading } = useCollection<Item>(itemsQuery);

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "distance", label: "Nearest" },
  ];
  
  const handleCategoryChange = (categorySlug: string) => {
    const categoryName = categorySlug === 'all' ? 'all' : categorySlug;
    setActiveCategory(categoryName);
  };

  const isLoading = areItemsLoading || !items;

  const pageTitle = selectedLocality ? (activeCategory === 'all'
    ? <>Browse Electronics in <span className="text-primary">{selectedLocality}</span></>
    : <>{activeCategory} in <span className="text-primary">{selectedLocality}</span></>)
    : "Loading Listings...";


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
          {pageTitle}
        </h1>
      </div>
      
      <div className='space-y-4'>
        <CategoryScroller activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        <FilterPills sortOptions={sortOptions} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
             <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
            icon={Package}
            title="No Listings Found"
            description={`There are currently no listings for "${activeCategory}" in ${selectedLocality}. Try another category or location!`}
        />
      )}
    </>
  )
}
