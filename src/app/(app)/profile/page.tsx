import Image from "next/image"
import { Star, Package, Recycle, Calendar, User, MoreVertical } from "lucide-react"

import { loggedInUser, items as allItems } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ItemCard } from "@/components/item-card"
import { EmptyState } from "@/components/empty-state"

const userItems = allItems.filter(item => item.seller.id === loggedInUser.id);
const recycledItems = [] // Mock data for recycled items

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
              <AvatarFallback className="text-3xl">{loggedInUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-1">
              <h1 className="font-headline text-3xl font-bold">{loggedInUser.name}</h1>
              <div className="flex items-center justify-center gap-1 text-muted-foreground md:justify-start">
                <Calendar className="h-4 w-4" />
                <span>Joined {loggedInUser.joinDate}</span>
              </div>
              <div className="flex items-center justify-center gap-1 font-semibold text-yellow-500 md:justify-start">
                <Star className="h-4 w-4 fill-current" />
                <span>{loggedInUser.avgRating} Average Rating</span>
              </div>
            </div>
            <div className="flex gap-2">
                <Button>Edit Profile</Button>
                <Button variant="outline">Share</Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">{userItems.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Recycle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items Recycled</p>
                <p className="text-2xl font-bold">{loggedInUser.itemsRecycled}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active-listings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active-listings">Active Listings</TabsTrigger>
          <TabsTrigger value="recycled-history">Recycled History</TabsTrigger>
        </TabsList>
        <TabsContent value="active-listings" className="mt-6">
            {userItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {userItems.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Package}
                    title="No Active Listings"
                    description="You haven't listed any items yet. Let's give your old tech a new life!"
                    ctaText="Post Your First Item"
                    ctaHref="/post"
                />
            )}
        </TabsContent>
        <TabsContent value="recycled-history" className="mt-6">
            {recycledItems.length > 0 ? (
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Map over recycled items here */}
                </div>
            ) : (
                <EmptyState
                    icon={Recycle}
                    title="No Recycled Items Yet"
                    description="Once you complete a transaction, your recycled items will appear here."
                />
            )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
