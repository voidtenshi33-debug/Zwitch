
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Star, ImageOff } from "lucide-react"
import { Timestamp } from 'firebase/firestore';
import React, { useState, useEffect } from "react";

import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc, arrayUnion, arrayRemove } from "firebase/firestore";

interface ItemCardProps {
  item: Item
  userWishlist?: string[];
}

export function ItemCard({ item, userWishlist = [] }: ItemCardProps) {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    setIsWishlisted(userWishlist.includes(item.id));
  }, [userWishlist, item.id]);


  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (!authUser || !firestore) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to manage your wishlist.",
      });
      return;
    }

    const userRef = doc(firestore, "users", authUser.uid);
    const newItemState = !isWishlisted;
    
    // Optimistic update of UI
    setIsWishlisted(newItemState);

    try {
      if (newItemState) {
        setDocumentNonBlocking(userRef, { wishlist: arrayUnion(item.id) }, { merge: true });
        toast({
          title: "Added to Wishlist!",
          description: `${item.title} has been added to your collection.`,
        });
      } else {
        setDocumentNonBlocking(userRef, { wishlist: arrayRemove(item.id) }, { merge: true });
        toast({
          title: "Removed from Wishlist",
          description: `${item.title} has been removed.`,
        });
      }
    } catch (error) {
        console.error("Error updating wishlist:", error);
        // Revert optimistic update on error
        setIsWishlisted(!newItemState); 
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Could not update your wishlist. Please try again.",
        });
    }
  };


  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative">
        <Link href={`/item/${item.id}`} className="absolute inset-0 z-10">
            <span className="sr-only">View Item</span>
        </Link>
        <div className="aspect-[4/3] w-full bg-secondary flex items-center justify-center">
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <Image
                  src={item.imageUrls[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
              />
            ) : (
              <ImageOff className="h-12 w-12 text-muted-foreground" />
            )}
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
            {item.isFeatured && <Badge className="bg-yellow-500 text-black hover:bg-yellow-600"><Star className="mr-1 h-3 w-3" /> Featured</Badge>}
            <Badge variant="secondary">{item.condition}</Badge>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm z-20"
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("h-4 w-4 transition-colors", isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground')} />
          <span className="sr-only">Save to wishlist</span>
        </Button>
      </div>
      <CardContent className="flex flex-1 flex-col p-4 pb-2">
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold tracking-tight">
              <Link href={`/item/${item.id}`} className="hover:underline z-10 relative">{item.title}</Link>
          </h3>
          <p className="font-headline text-xl font-bold text-foreground mt-1">
            {item.listingType === "Sell" ? `₹${item.price.toLocaleString('en-IN')}` : <span className="text-primary">{item.listingType}</span>}
          </p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0"/>
            <span className="truncate">{item.locality}, Pune</span>
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <Button asChild className="w-full" variant="outline">
            <Link href={`/item/${item.id}`}>View Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
