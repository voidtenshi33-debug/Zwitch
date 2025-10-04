'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell, Home, Heart, MessageSquare, PlusSquare, User, Menu, Search, LogOut, Settings, PanelLeft, X, Mic, MapPin, ChevronDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { notifications, popularLocations } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { User as UserType } from '@/lib/types';


const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/post', icon: PlusSquare, label: 'Post Item' },
  { href: '/chat', icon: MessageSquare, label: 'Chats' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/profile', icon: User, label: 'Profile' },
];

function getInitials(name: string | null | undefined) {
  if (!name) return "";
  const names = name.split(' ');
  const initials = names.map(n => n.charAt(0)).join('');
  return initials.toUpperCase();
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocality, setCurrentLocality] = useState('Pune');
  const [locationSearch, setLocationSearch] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserType>(userRef);

  useEffect(() => {
    if (userProfile?.lastKnownLocality) {
      setCurrentLocality(userProfile.lastKnownLocality);
    }
  }, [userProfile]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchText(transcript);
        performSearch(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleListen = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
        setIsListening(false);
      }
    }
  };

  const performSearch = (query: string) => {
    console.log('Searching for:', query);
    // router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const handleSelectLocality = (locality: string) => {
      setCurrentLocality(locality);
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        setDocumentNonBlocking(userDocRef, { lastKnownLocality: locality }, { merge: true });
      }
      setIsLocationModalOpen(false);
      // This will trigger a re-render in DashboardPage because the prop changes.
      // We pass the locality to the children.
      // A more robust solution might use a global state manager (Context/Redux).
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // In a real app, you would use a reverse geocoding service here
            // to convert lat/lng to a locality.
            // For this demo, we'll just pick a random one.
            const randomLocality = popularLocations[Math.floor(Math.random() * popularLocations.length)];
            handleSelectLocality(randomLocality);
            setIsDetectingLocation(false);
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                setLocationError("Location access was denied. Please enable it in your browser settings.");
            } else {
                setLocationError("Could not determine your location. Please select it manually.");
            }
            setIsDetectingLocation(false);
        }
    );
  };

  const filteredLocations = popularLocations.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const loggedInUser = {
      name: user?.displayName || "Anonymous",
      avatarUrl: user?.photoURL || "",
  }

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
     if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // @ts-ignore
      return React.cloneElement(child, { selectedLocality: currentLocality });
    }
    return child;
  });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] dark:bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn(
          "hidden border-r bg-muted/40 md:block transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:w-[220px] lg:w-[280px]" : "md:w-20"
        )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo className={cn("text-2xl", !isSidebarOpen && "text-primary")} isDashboard />
              <span className={cn("font-headline sr-only", isSidebarOpen && "lg:not-sr-only")}></span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <PanelLeft className={cn("h-4 w-4 transition-transform", !isSidebarOpen && "rotate-180")} />
            </Button>
          </div>
          <nav className={cn("flex flex-col items-start gap-2 px-2 text-sm font-medium lg:px-4", !isSidebarOpen && "items-center px-0 lg:px-0")}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary",
                  !isSidebarOpen && "justify-center"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon className="h-4 w-4" />
                <span className={cn(isSidebarOpen ? "" : "sr-only")}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="mb-4 flex items-center gap-2 text-lg font-semibold"
                >
                  <Logo isDashboard />
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileSheetOpen(false)}
                    className={cn(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                      pathname === item.href && "bg-muted text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" className="shrink-0" onClick={() => setIsLocationModalOpen(true)}>
            <MapPin className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">{currentLocality}, Pune</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>

          <div className="w-full flex-1">
            <form onSubmit={(e) => { e.preventDefault(); performSearch(searchText); }}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 pr-8 shadow-none"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {recognitionRef.current && (
                   <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleListen}>
                     <Mic className="h-4 w-4" />
                   </Button>
                )}
              </div>
            </form>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="relative rounded-full">
                <Bell className="h-4 w-4" />
                {notifications.filter(n => !n.isRead).length > 0 && 
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 4).map(n => (
                <DropdownMenuItem key={n.id} asChild>
                  <Link href={n.href} className="flex items-start gap-2 whitespace-normal">
                    <div className="flex-1">
                      <p className={cn("text-sm", !n.isRead && "font-semibold")}>{n.text}</p>
                      <p className="text-xs text-muted-foreground">{n.timestamp}</p>
                    </div>
                    {!n.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                  </Link>
                </DropdownMenuItem>
              ))}
               <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                  <Link href="/notifications" className="text-center justify-center">View All Notifications</Link>
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
                  <AvatarFallback>{getInitials(loggedInUser.name)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {childrenWithProps}
        </main>
      </div>

       <Dialog open={isListening} onOpenChange={setIsListening}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Listening...</DialogTitle>
            <DialogDescription className="text-center">
              Speak your search query now.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Mic className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Select Your Location</DialogTitle>
                <DialogDescription>
                    Browse listings from your preferred locality in Pune.
                </DialogDescription>
            </DialogHeader>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search for a locality..."
                    className="pl-8"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleDetectLocation} disabled={isDetectingLocation}>
                    <MapPin className="mr-2 h-4 w-4" />
                    {isDetectingLocation ? 'Detecting your location...' : 'Use current location'}
                </Button>
                {locationError && (
                    <Alert variant="destructive">
                        <AlertTitle>Location Error</AlertTitle>
                        <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                )}
            </div>
            <div className="flex-1 overflow-y-auto max-h-60 pr-2 -mr-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Popular Locations</p>
                <div className="space-y-1">
                    {filteredLocations.map(loc => (
                        <Button
                            key={loc}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleSelectLocality(loc)}
                        >
                            {loc}
                        </Button>
                    ))}
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
