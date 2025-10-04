
"use client"

import Link from 'next/link';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface CategoryScrollerProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}


export function CategoryScroller({ activeCategory, onCategoryChange }: CategoryScrollerProps) {
  const allCategory = { id: 0, name: 'All', icon: () => null, slug: 'all' };
  const displayCategories = [allCategory, ...categories];

  return (
    <div className="relative py-4">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {displayCategories.map((category) => {
          const isActive = category.name === activeCategory;
          return (
            <div key={category.id} className="flex-shrink-0 text-center">
              <Button
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center transition-all duration-200 hover:shadow-lg",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => onCategoryChange(category.name)}
              >
                  {category.id !== 0 && <category.icon className="h-8 w-8" />}
                  <span className="text-xs font-medium leading-tight">{category.name}</span>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
