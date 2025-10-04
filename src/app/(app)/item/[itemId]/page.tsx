
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  Tag,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


// This is a placeholder for the actual item data.
// In a real implementation, you would fetch this data from Firestore based on the `itemId` param.
const mockItem = {
    id: 'item-1',
    title: "Sony Noise-Cancelling Headphones",
    price: 8000,
    listingType: 'Sell',
    imageUrls: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf40B1?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613040809024-b4efc1ba69c7?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596700247352-32b3a88b58aaa?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["Audio Devices", "Working", "Featured"],
    description: "WH-1000XM4 model. Excellent condition, comes with the original case. The sound quality is amazing. I've only used it for about 6 months and am selling because I got a new pair as a gift. No scratches or marks.",
    locality: 'Baner',
    seller: {
        name: 'Anjali Sharma',
        avatarUrl: 'https://i.pravatar.cc/150?u=anjali',
        rating: 4.9,
        reviews: 15,
        joinedDate: 'October 2023',
        isTrusted: true,
        badges: [
            { icon: ShieldCheck, text: 'ID Verified' },
            { icon: Award, text: '8+ Items Recycled' },
            { icon: Zap, text: 'Quick Responder' },
        ],
    },
};

export default function ItemDetailsPage({ params }: { params: { itemId: string } }) {
  const isTrustedSeller = mockItem.seller.isTrusted;

  return (
    <div className="container mx-auto max-w-4xl py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Image Carousel */}
            <div>
                <Carousel className="w-full">
                <CarouselContent>
                    {mockItem.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                            <div className="aspect-[4/3] relative">
                                <Image
                                src={url}
                                alt={`${mockItem.title} image ${index + 1}`}
                                fill
                                className="object-cover"
                                />
                            </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
                </Carousel>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
                {/* Section 2: Core Details */}
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {mockItem.tags.map(tag => (
                            <Badge key={tag} variant={tag === 'Featured' ? 'default' : 'secondary'}>
                                {tag === 'Featured' && <Star className="h-3 w-3 mr-1"/>}
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="font-headline text-3xl font-bold">{mockItem.title}</h1>
                    <p className="font-headline text-2xl font-bold text-foreground mt-2">
                        {mockItem.listingType === 'Sell' ? `₹${mockItem.price.toLocaleString('en-IN')}` : <span className="text-primary">{mockItem.listingType}</span>}
                    </p>
                </div>

                 {/* Section 3: Trust Center */}
                <Card className="overflow-hidden bg-muted/30">
                    <CardContent className="p-4">
                        <Link href="#">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-background">
                                    <AvatarImage src={mockItem.seller.avatarUrl} />
                                    <AvatarFallback>{mockItem.seller.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{mockItem.seller.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                        <span>{mockItem.seller.rating} ({mockItem.seller.reviews} ratings)</span>
                                    </div>
                                </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                                {mockItem.seller.badges.map(badge => {
                                    const BadgeIcon = badge.icon;
                                    return (
                                        <div key={badge.text} className="flex items-center gap-1.5">
                                            <BadgeIcon className="h-4 w-4 text-primary" />
                                            <span>{badge.text}</span>
                                        </div>
                                    );
                                })}
                                 <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>Joined {mockItem.seller.joinedDate}</span>
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                {/* Section 4: Description */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{mockItem.description}</p>
                </div>

                {/* Section 5: Location */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Location</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{mockItem.locality}, Pune</span>
                    </div>
                     <Card className="mt-2">
                        <CardContent className="p-0">
                            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
                                Map placeholder
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        {/* Section 6: Action Block (Sticky Footer) */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm md:static md:border-none md:bg-transparent md:p-0 z-50">
            <div className="container mx-auto max-w-4xl p-4">
                 {isTrustedSeller ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Buy Now - ₹{mockItem.price.toLocaleString('en-IN')}</Button>
                        <Button size="lg" variant="outline"><MessageSquare className="mr-2 h-5 w-5"/>Message Seller</Button>
                    </div>
                ) : (
                    <Button size="lg" className="w-full"><MessageSquare className="mr-2 h-5 w-5"/>Message Seller</Button>
                )}
            </div>
        </div>
    </div>
  );
}
