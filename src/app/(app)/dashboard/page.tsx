import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemCard } from "@/components/item-card"
import { items } from "@/lib/data"
import { CategoryScroller } from "@/components/category-scroller"
import { categories } from "@/lib/categories"

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
          Browse Electronics
        </h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px] hidden sm:flex">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="distance">Nearest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CategoryScroller />

      <div className="flex items-center justify-between pt-4">
         <h2 className="font-headline text-xl font-bold tracking-tight md:text-2xl">
          Latest Listings
        </h2>
         <Select>
            <SelectTrigger className="w-[180px] hidden md:flex">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.slug} value={category.slug}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
