import type { ImagePlaceholder } from './placeholder-images';

export type User = {
  id: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  createdAt: string;
  joinDate: string;
  avgRating: number;
  itemsRecycled: number;
  lastKnownLocality: string;
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
  seller: {
      id: string;
      name: string;
      avatarUrl: string;
      avgRating: number;
  };
  postedAt: string;
  location: string;
  locality: string;
  isFeatured?: boolean;
  isVerified?: boolean;
};

export type Chat = {
    id: string;
    user: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    lastMessage: string;
    lastMessageTimestamp: string;
    unreadCount: number;
};

export type ChatMessage = {
    id:string;
    text: string;
    timestamp: string;
    sender: 'me' | {
        name: string;
        avatarUrl: string;
    };
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
