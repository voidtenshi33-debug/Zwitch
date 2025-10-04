"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';

const onboardingSteps = [
  {
    image: PlaceHolderImages.find(img => img.id === 'onboarding-post')!,
    step: "Step 1",
    title: "Post Your Item",
    description: "Snap a few photos, write a quick description, and let our AI help you pick the right category. Listing an item has never been easier."
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'onboarding-connect')!,
    step: "Step 2",
    title: "Connect Securely",
    description: "Use our in-app chat to talk to potential buyers or recipients. Your personal contact information stays private until you decide to share it."
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'onboarding-recycle')!,
    step: "Step 3",
    title: "Recycle & Rate",
    description: "Once your item has a new home, mark it as recycled. Build your reputation by rating your experience and help us create a trustworthy community."
  }
];

export function OnboardingCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full max-w-sm md:max-w-xl"
    >
      <CarouselContent>
        {onboardingSteps.map((step, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <div className="relative h-60 w-full">
                    <Image
                      src={step.image.imageUrl}
                      alt={step.image.description}
                      data-ai-hint={step.image.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <Badge variant="secondary" className="mb-2">{step.step}</Badge>
                    <h3 className="font-headline text-2xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
