import Image from "next/image"
import Link from "next/link"
import { Send, Paperclip, CheckCheck } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// This would be replaced with real data fetching
const mockChatPageData = {
  chats: [
    {
      id: 'chat-1',
      user: { name: 'Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=anjali' },
      item: { id: 'item-2', title: 'Apple iPhone X - For Donation' },
      lastMessage: 'Is this still available?',
      unreadCount: 1,
    },
    {
      id: 'chat-2',
      user: { name: 'Vikram Singh', avatarUrl: 'https://i.pravatar.cc/150?u=vikram' },
      item: { id: 'item-3', title: 'Logitech Mechanical Gaming Keyboard' },
      lastMessage: "Great, I can pick it up tomorrow.",
      unreadCount: 0,
    }
  ],
  activeChat: {
    item: {
      id: 'item-2',
      title: 'Apple iPhone X - For Donation',
      imageUrls: ['https://images.unsplash.com/photo-1592286928828-5f9b4421b92d'],
      listingType: 'Donate',
      price: 0,
    },
    user: { name: 'Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=anjali' }
  },
  messages: [
     { id: 'msg-1', sender: { name: 'Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=anjali' }, text: "Hi! I'm interested in the iPhone. Is it still available?", timestamp: "12m ago", read: true },
    { id: 'msg-2', sender: 'me', text: "Hey! Yes, it is.", timestamp: "11m ago", read: true },
    { id: 'msg-3', sender: { name: 'Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=anjali' }, text: "Great. Where can I pick it up?", timestamp: "10m ago", read: false },
  ]
}

export default function ChatPage() {
  const { chats, activeChat, messages } = mockChatPageData;

  return (
    <div className="grid h-[calc(100vh-theme(spacing.16))] w-full grid-cols-[260px_1fr] rounded-lg border">
      <div className="border-r bg-muted/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-4">
            <h2 className="font-headline text-xl font-semibold">Chats</h2>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {chats.map((chat, index) => (
                <Link
                  key={chat.id}
                  href="#"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                    index === 0 && "bg-muted text-primary"
                  )}
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={chat.user.avatarUrl} alt={chat.user.name} />
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-semibold">{chat.user.name}</p>
                    <p className="text-xs text-muted-foreground">Re: {chat.item.title}</p>
                    <p className="truncate text-xs">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {chat.unreadCount}
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
           <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
                <AvatarImage src={activeChat.user.avatarUrl} alt={activeChat.user.name} />
                <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="font-semibold">{activeChat.user.name}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
           </div>
        </header>

        <div className="border-b bg-background/95 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                    <Image src={activeChat.item.imageUrls[0]} alt={activeChat.item.title} fill className="rounded-md object-cover" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold leading-snug">{activeChat.item.title}</p>
                    {activeChat.item.listingType === "Sell" && activeChat.item.price ? (
                        <p className="font-bold text-primary">₹{activeChat.item.price.toLocaleString()}</p>
                    ) : (
                        <Badge variant="secondary">{activeChat.item.listingType}</Badge>
                    )}
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/item/${activeChat.item.id}`}>View Listing</Link>
                </Button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.sender === "me" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender !== "me" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatarUrl} />
                  <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg p-3",
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                 <div className="mt-2 flex items-center justify-end gap-1 text-xs opacity-70">
                    <span>{message.timestamp}</span>
                    {message.sender === 'me' && (
                        <CheckCheck className={cn("h-4 w-4", message.read ? "text-blue-400" : "")} />
                    )}
                 </div>
              </div>
            </div>
          ))}
           <div className="flex items-end gap-2 justify-start">
             <Avatar className="h-8 w-8">
                <AvatarImage src={activeChat.user.avatarUrl} />
                <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: '0s' }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: '0.2s' }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: '0.4s' }} />
            </div>
           </div>
        </div>

        <div className="border-t bg-muted/40 p-4 space-y-3">
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button size="sm" variant="outline" className="flex-shrink-0">Is this available?</Button>
              <Button size="sm" variant="outline" className="flex-shrink-0">I'll take it!</Button>
              <Button size="sm" variant="outline" className="flex-shrink-0">When can we meet?</Button>
           </div>
           <form className="relative">
            <Input
              placeholder="Type your message..."
              className="pr-20 bg-background"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button type="button" size="icon" variant="ghost">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" variant="ghost" className="text-primary hover:text-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
