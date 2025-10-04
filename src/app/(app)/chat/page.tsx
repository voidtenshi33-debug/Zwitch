import Image from "next/image"
import Link from "next/link"
import { Search, Send, Paperclip } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { chats, messages as mockMessages, loggedInUser } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const activeChat = chats[0];
  const messages = mockMessages;

  return (
    <div className="grid h-[calc(100vh-theme(spacing.16))] w-full grid-cols-[260px_1fr] rounded-lg border">
      <div className="border-r bg-muted/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[52px] items-center border-b px-4 lg:h-[60px]">
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
        <header className="flex h-[52px] items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px]">
           <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border">
                <AvatarImage src={activeChat.user.avatarUrl} alt={activeChat.user.name} />
                <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{activeChat.user.name}</span>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  "max-w-xs rounded-lg p-3 md:max-w-md",
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                 <p className="mt-1 text-right text-xs opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t bg-muted/40 p-4">
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
