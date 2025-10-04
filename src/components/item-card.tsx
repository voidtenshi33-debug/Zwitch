import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, ShieldCheck, Star } from "lucide-react"

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

interface ItemCardProps {
  item: Item
}

function getInitials(name: string | null | undefined) {
  if (!name) return "";
  const names = name.split(' ');
  const initials = names.map(n => n.charAt(0)).join('');
  return initials.toUpperCase();
}


export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative">
        <div className="aspect-[4/3] w-full">
            <Image
                src={item.image.imageUrl}
                alt={item.title}
                data-ai-hint={item.image.imageHint}
                fill
                className="object-cover"
            />
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
            {item.isFeatured && <Badge className="bg-yellow-500 text-black hover:bg-yellow-600"><Star className="mr-1 h-3 w-3" /> Featured</Badge>}
            {item.isVerified && <Badge className="bg-blue-600 text-white hover:bg-blue-700"><ShieldCheck className="mr-1 h-3 w-3" /> Verified</Badge>}
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Save to wishlist</span>
        </Button>
      </div>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
            <p className="font-headline text-lg font-bold tracking-tight">
                <Link href="#" className="hover:underline">{item.title}</Link>
            </p>
            {item.listingType === "Sell" && item.price ? (
                <p className="font-headline text-xl font-bold text-foreground">₹{item.price.toLocaleString()}</p>
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
            <AvatarImage src={item.seller.avatarUrl} alt={item.seller.name} />
            <AvatarFallback>{getInitials(item.seller.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <p className="text-sm font-semibold">{item.seller.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
                <span className="font-semibold">{item.seller.avgRating}</span>
            </div>
        </div>
        <p className="text-xs text-muted-foreground">{item.postedAt}</p>
      </CardFooter>
    </Card>
  )
}
