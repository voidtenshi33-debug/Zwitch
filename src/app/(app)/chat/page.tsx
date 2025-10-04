
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  const [chats, setChats] = useState([]);

  if (chats.length === 0) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.28))] items-center justify-center rounded-lg border bg-background">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"></div>
            <MessageSquare className="h-20 w-20 text-primary" strokeWidth={1.5} />
             <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-accent" />
             <Sparkles className="absolute -bottom-4 left-8 h-5 w-5 text-accent/70" />
          </div>
          <div className="max-w-md">
            <h3 className="font-headline text-2xl font-bold">Your conversations live here</h3>
            <p className="mt-2 text-muted-foreground">
              When you message a seller about an item, your chat will appear here. Start exploring to find something you love!
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard">Explore Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  // The existing chat UI will be rendered here when `chats` array is not empty.
  // This part is left for future implementation when real chat data is integrated.
  return (
    <div>
        {/* Placeholder for when chats exist */}
    </div>
  );
}
