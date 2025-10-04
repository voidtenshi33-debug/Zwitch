
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, ShieldCheck, Star } from "lucide-react"
import { formatDistanceToNow } from 'date-fns';
import { Timestamp, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

interface ItemCardProps {
  item: Item
  userWishlist?: string[];
}

function getInitials(name: string | null | undefined) {
  if (!name) return "";
  const names = name.split(' ');
  const initials = names.map(n => n.charAt(0)).join('');
  return initials.toUpperCase();
}


export function ItemCard({ item, userWishlist = [] }: ItemCardProps) {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    setIsWishlisted(userWishlist.includes(item.id));
  }, [userWishlist, item.id]);


  const postedAt = item.postedAt
    ? formatDistanceToNow((item.postedAt as Timestamp).toDate(), { addSuffix: true })
    : 'Just now';

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
    setIsWishlisted(newItemState); // Optimistic update

    try {
      if (newItemState) {
        await updateDoc(userRef, {
          wishlist: arrayUnion(item.id)
        });
        toast({
          title: "Added to Wishlist!",
          description: `${item.title} has been saved.`,
        });
      } else {
        await updateDoc(userRef, {
          wishlist: arrayRemove(item.id)
        });
        toast({
          title: "Removed from Wishlist",
          description: `${item.title} has been removed.`,
        });
      }
    } catch (error) {
        console.error("Error updating wishlist:", error);
        setIsWishlisted(!newItemState); // Revert optimistic update
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
        <Link href="#" className="absolute inset-0 z-10">
            <span className="sr-only">View Item</span>
        </Link>
        <div className="aspect-[4/3] w-full">
            <Image
                src={item.imageUrls[0]}
                alt={item.title}
                fill
                className="object-cover"
            />
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
            {item.isFeatured && <Badge className="bg-yellow-500 text-black hover:bg-yellow-600"><Star className="mr-1 h-3 w-3" /> Featured</Badge>}
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
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
            <p className="font-headline text-lg font-bold tracking-tight">
                <Link href="#" className="hover:underline z-10 relative">{item.title}</Link>
            </p>
            {item.listingType === "Sell" && item.price ? (
                <p className="font-headline text-xl font-bold text-foreground">₹{item.price.toLocaleString('en-IN')}</p>
            ) : (
                <Badge variant="secondary" className="text-base font-semibold">{item.listingType}</Badge>
            )}
        </div>

        <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1"/>
            <span>{item.locality}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-3 border-t p-3">
        <Avatar className="h-8 w-8">
            <AvatarImage src={item.ownerAvatarUrl || undefined} alt={item.ownerName} />
            <AvatarFallback>{getInitials(item.ownerName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <p className="text-sm font-semibold">{item.ownerName}</p>
            <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
                <span className="font-semibold">{item.ownerRating}</span>
            </div>
        </div>
        <p className="text-xs text-muted-foreground">{postedAt}</p>
      </CardFooter>
    </Card>
  )
}
