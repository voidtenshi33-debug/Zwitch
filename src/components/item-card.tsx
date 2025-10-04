import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="aspect-video">
          <Image
            src={item.image.imageUrl}
            alt={item.title}
            data-ai-hint={item.image.imageHint}
            fill
            className="object-cover"
          />
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Save to wishlist</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className="whitespace-nowrap">{item.category}</Badge>
            <p className="font-semibold text-lg">
                {item.listingType === "Sell" && item.price ? `$${item.price}` : <span className="text-primary">{item.listingType}</span>}
            </p>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold leading-snug">
          <Link href="#" className="hover:underline">
            {item.title}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
        <p>{item.location}</p>
        <p className="ml-auto">{item.postedAt}</p>
      </CardFooter>
    </Card>
  )
}
