import { ItemCard } from "@/components/item-card"
import { EmptyState } from "@/components/empty-state"
import { items } from "@/lib/data"
import { Heart } from "lucide-react"

// In a real app, this would be fetched for the logged-in user.
// We'll show a subset for demonstration.
const wishlistedItems = items.slice(3, 5);

export default function WishlistPage() {
  return (
    <>
      <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
        My Wishlist
      </h1>
      {wishlistedItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {wishlistedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any items yet. Start exploring and tap the heart icon on items you like!"
          ctaText="Explore Listings"
          ctaHref="/dashboard"
        />
      )}
    </>
  )
}
