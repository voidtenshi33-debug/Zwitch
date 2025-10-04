import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OnboardingCarousel } from '@/components/onboarding-carousel';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-16 text-center md:px-6 md:py-24 lg:py-32">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Give Your Electronics a Second Life
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Zwitch is the easiest way to sell, donate, or recycle your used electronics. Join a community dedicated to reducing e-waste and finding value in every device.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section className="w-full bg-secondary/50 py-16 md:py-24 lg:py-32">
           <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  How It Works
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Post your item in seconds, connect with buyers, and give your old tech a new home.
                </p>
              </div>
              <div className="mt-12 flex justify-center">
                <OnboardingCarousel />
              </div>
           </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Zwitch. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
