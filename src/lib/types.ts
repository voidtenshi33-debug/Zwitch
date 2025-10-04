import type { ImagePlaceholder } from './placeholder-images';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  joinDate: string;
  avgRating: number;
  itemsRecycled: number;
};

export type ItemCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Needs Minor Repair' | 'For Spare Parts';
export type ListingType = 'Sell' | 'Donate' | 'Spare Parts';

export type Item = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  condition: ItemCondition;
  listingType: ListingType;
  image: ImagePlaceholder;
  seller: User;
  postedAt: string;
  location: string;
};

export type Chat = {
    id: string;
    user: User;
    lastMessage: string;
    lastMessageTimestamp: string;
    unreadCount: number;
};

export type ChatMessage = {
    id:string;
    text: string;
    timestamp: string;
    sender: 'me' | User;
    read: boolean;
};

export type Notification = {
    id: string;
    type: 'chat' | 'status' | 'admin' | 'recycle';
    text: string;
    timestamp: string;
    isRead: boolean;
    href: string;
};
