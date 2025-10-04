'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Category } from '@/lib/categories';

interface FilterPillsProps {
  sortOptions: { value: string; label: string }[];
  categories: Category[];
}

export function FilterPills({ sortOptions, categories }: FilterPillsProps) {
  const [activeSort, setActiveSort] = useState(sortOptions[0].value);
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex-shrink-0">
            <ListFilter className="mr-2 h-4 w-4" />
            Sort by
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={activeSort} onValueChange={setActiveSort}>
            {sortOptions.map(option => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-6 border-l border-muted-foreground/20" />

      <Button
        variant={activeCategory === 'all' ? 'default' : 'outline'}
        className="rounded-full flex-shrink-0"
        onClick={() => setActiveCategory('all')}
      >
        All
      </Button>

      {categories.map(category => (
        <Button
          key={category.slug}
          variant={activeCategory === category.slug ? 'default' : 'outline'}
          className="rounded-full flex-shrink-0"
          onClick={() => setActiveCategory(category.slug)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
