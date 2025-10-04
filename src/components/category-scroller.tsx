"use client"

import Link from 'next/link';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

export function CategoryScroller() {
  return (
    <div className="relative py-4">
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {categories.map((category) => (
          <Link
            href={`/search?category=${category.slug}`}
            key={category.id}
            className="group flex-shrink-0 text-center transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/70 backdrop-blur-sm transition-all duration-200 group-hover:bg-primary/90 group-hover:shadow-lg"
            )}>
              <category.icon className="h-10 w-10 text-muted-foreground transition-colors duration-200 group-hover:text-primary-foreground" />
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
