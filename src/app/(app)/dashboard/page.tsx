'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemCard } from "@/components/item-card"
import { items as allItems } from "@/lib/data"
import { CategoryScroller } from "@/components/category-scroller"
import { categories } from "@/lib/categories"
import { FilterPills } from '@/components/filter-pills';

export default function DashboardPage({ selectedLocality }: { selectedLocality: string }) {
  // In a real app, this data would be fetched from Firestore based on the selectedLocality
  const filteredItems = allItems.filter(item => item.locality === selectedLocality);
  
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "distance", label: "Nearest" },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
          Browse Electronics in <span className="text-primary">{selectedLocality}</span>
        </h1>
      </div>
      
      <div className='space-y-4'>
        <CategoryScroller />
        <FilterPills sortOptions={sortOptions} categories={categories} />
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
