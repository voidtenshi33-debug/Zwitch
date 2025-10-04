"use client"

import Link from 'next/link';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

export function CategoryScroller() {
  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
        {categories.map((category) => (
          <Link 
            href={`/search?category=${category.slug}`} 
            key={category.id} 
            className="group flex-shrink-0 text-center"
          >
            <div className={cn(
                "flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary"
            )}>
              <category.icon className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
