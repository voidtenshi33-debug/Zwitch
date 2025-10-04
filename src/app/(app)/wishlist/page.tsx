
'use client';

import { useState, useEffect } from "react";
import { ItemCard } from "@/components/item-card"
import { EmptyState } from "@/components/empty-state"
import { Heart } from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, documentId } from "firebase/firestore";
import type { Item, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { doc } from 'firebase/firestore';
import { useDoc } from "@/firebase/firestore/use-doc";


export default function WishlistPage() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, "users", authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userRef);

  const wishlistQuery = useMemoFirebase(() => {
    if (!firestore || !userProfile || !userProfile.wishlist || userProfile.wishlist.length === 0) {
      return null;
    }
    return query(collection(firestore, "items"), where(documentId(), "in", userProfile.wishlist));
  }, [firestore, userProfile]);

  const { data: wishlistedItems, isLoading: areItemsLoading } = useCollection<Item>(wishlistQuery);

  const isLoading = isAuthLoading || isProfileLoading || areItemsLoading;

  // Handle case where wishlist is defined but empty, so query is null but we are not loading.
  const isWishlistEmpty = !isLoading && (!wishlistedItems || wishlistedItems.length === 0);

  return (
    <>
      <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
        My Wishlist
      </h1>
      {isLoading ? (
         <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
            ))}
        </div>
      ) : isWishlistEmpty ? (
        <EmptyState 
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any items yet. Start exploring and tap the heart icon on items you like!"
          ctaText="Explore Listings"
          ctaHref="/dashboard"
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistedItems!.map((item) => (
            <ItemCard key={item.id} item={item} userWishlist={userProfile?.wishlist || []} />
          ))}
        </div>
      )}
    </>
  )
}
