import type { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  createdAt: Timestamp | string;
  joinDate?: string;
  avgRating?: number;
  itemsRecycled?: number;
  lastKnownLocality: string;
};

export type ItemCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Needs Minor Repair' | 'For Spare Parts' | 'Working' | 'For Parts Only';
export type ListingType = 'Sell' | 'Donate' | 'Spare Parts';
export type ItemStatus = 'Available' | 'Sold' | 'Recycled';

export type Item = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  condition: ItemCondition;
  listingType: ListingType;
  imageUrls: string[];
  locality: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string | null;
  ownerRating: number;
  status: ItemStatus;
  isFeatured: boolean;
  postedAt: Timestamp | string; // Can be a timestamp or a string like "2 days ago"
};


export type Chat = {
    id: string;
    item: Pick<Item, 'id' | 'title' | 'imageUrls' | 'price' | 'listingType'>;
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
