
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
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
import { Separator } from '@/components/ui/separator';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Item, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function getInitials(name: string | null | undefined) {
  if (!name) return "";
  const names = name.split(' ');
  const initials = names.map(n => n.charAt(0)).join('');
  return initials.toUpperCase();
}


const mockSellerBadges = [
    { icon: ShieldCheck, text: 'ID Verified' },
    { icon: Award, text: '8+ Gadgets Recycled' },
    { icon: Zap, text: 'Quick Responder' },
];


export default function ItemDetailsPage({ params }: { params: { itemId: string } }) {
  const firestore = useFirestore();

  const itemRef = useMemoFirebase(() => {
    if (!firestore || !params.itemId) return null;
    return doc(firestore, 'items', params.itemId);
  }, [firestore, params.itemId]);
  const { data: item, isLoading: isItemLoading } = useDoc<Item>(itemRef);

  const sellerRef = useMemoFirebase(() => {
    if (!firestore || !item?.ownerId) return null;
    return doc(firestore, 'users', item.ownerId);
  }, [firestore, item?.ownerId]);
  const { data: seller, isLoading: isSellerLoading } = useDoc<User>(sellerRef);
  
  const isLoading = isItemLoading || isSellerLoading;

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                <div className="md:col-span-3">
                    <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <Separator />
                    <Skeleton className="h-28 w-full" />
                    <Separator />
                    <div>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-5 w-40 mb-3" />
                        <Skeleton className="aspect-video w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (!item) {
    return <div>Item not found.</div>;
  }
  
  const isTrustedSeller = true; // Replace with actual logic, e.g., seller?.isTrusted

  return (
    <div className="container mx-auto max-w-5xl py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Left Column - Image Carousel */}
            <div className="md:col-span-3">
                <Carousel className="w-full">
                <CarouselContent>
                    {item.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                        <Card className="overflow-hidden rounded-xl">
                            <CardContent className="p-0">
                            <div className="aspect-[4/3] relative">
                                <Image
                                src={url}
                                alt={`${item.title} image ${index + 1}`}
                                fill
                                className="object-cover"
                                />
                            </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-2 md:-left-12" />
                <CarouselNext className="-right-2 md:-right-12" />
                </Carousel>
                
                {/* Description for Desktop */}
                <div className="hidden md:block mt-8">
                     <h2 className="text-xl font-bold mb-2 font-headline">Description</h2>
                    <p className="text-muted-foreground">{item.description}</p>
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6">
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="secondary">{item.condition}</Badge>
                        {item.isFeatured && <Badge><Star className="h-3 w-3 mr-1"/>Featured</Badge>}
                    </div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold">{item.title}</h1>
                    <p className="font-headline text-2xl font-bold text-foreground">
                        {item.listingType === 'Sell' ? <span className="text-primary">For Sale</span> : <span className="text-primary">{item.listingType}</span>}
                    </p>
                </div>

                <Separator />
                
                {seller && (
                <Card className="overflow-hidden bg-muted/30">
                    <CardContent className="p-4">
                        <Link href="#" className="block hover:bg-muted/50 -m-4 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-background">
                                    <AvatarImage src={seller.photoURL || undefined} />
                                    <AvatarFallback>{getInitials(seller.displayName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{seller.displayName}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                        <span>{seller.avgRating?.toFixed(1) || '0.0'} (0 ratings)</span>
                                    </div>
                                </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                {mockSellerBadges.map(badge => {
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
                                    <span>Joined {seller.joinDate}</span>
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
                )}

                <Separator />
                
                <div>
                    <h2 className="text-xl font-bold mb-2 font-headline">Location</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <MapPin className="h-5 w-5" />
                        <span>{item.locality}, Pune</span>
                    </div>
                     <Card>
                        <CardContent className="p-0">
                            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                                Map placeholder
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Description for Mobile */}
                 <div className="md:hidden">
                     <Separator />
                     <h2 className="text-xl font-bold mb-2 mt-6 font-headline">Description</h2>
                    <p className="text-muted-foreground">{item.description}</p>
                </div>
            </div>
        </div>

        {/* Action Block (Sticky Footer) */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm md:static md:bottom-auto md:left-auto md:right-auto md:z-auto md:border-none md:bg-transparent md:p-0 z-50 md:mt-8">
            <div className="container mx-auto max-w-5xl p-4 md:p-0">
                <div className="max-w-md ml-auto">
                 {isTrustedSeller && item.listingType === 'Sell' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                            <Link href={`/order/summary?itemId=${item.id}`}>Buy Now - ₹{item.price.toLocaleString('en-IN')}</Link>
                        </Button>
                        <Button size="lg" variant="outline"><MessageSquare className="mr-2 h-5 w-5"/>Message Seller</Button>
                    </div>
                ) : (
                    <Button size="lg" className="w-full"><MessageSquare className="mr-2 h-5 w-5"/>Message Seller</Button>
                )}
                </div>
            </div>
        </div>
    </div>
  );
}

    