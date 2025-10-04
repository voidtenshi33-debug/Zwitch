
'use client';

import { ItemCard } from "@/components/item-card"
import { EmptyState } from "@/components/empty-state"
import { Heart } from "lucide-react"
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Item } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // In a real app, wishlist would be a subcollection on the user document
  // For now, we'll just show some featured items as a stand-in
  const wishlistedItemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'items'), where('isFeatured', '==', true));
  }, [firestore]);

  const { data: wishlistedItems, isLoading } = useCollection<Item>(wishlistedItemsQuery);

  return (
    <>
      <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
        My Wishlist
      </h1>
      {isLoading ? (
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
            ))}
        </div>
      ) : wishlistedItems && wishlistedItems.length > 0 ? (
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
