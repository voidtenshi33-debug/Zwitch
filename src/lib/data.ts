import { PlaceHolderImages } from './placeholder-images';
import type { User, Item, Chat, ChatMessage, Notification, ItemCondition, ListingType } from './types';
import { categories as appCategories } from './categories';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) throw new Error(`Image with id ${id} not found`);
  return image;
};

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: findImage('avatar-1').imageUrl, joinDate: '2023-05-15', avgRating: 4.8, itemsRecycled: 12 },
  { id: 'user-2', name: 'Jane Smith', avatarUrl: findImage('avatar-2').imageUrl, joinDate: '2022-11-20', avgRating: 4.9, itemsRecycled: 25 },
  { id: 'user-3', name: 'Ben Starr', avatarUrl: findImage('avatar-3').imageUrl, joinDate: '2024-01-10', avgRating: 4.5, itemsRecycled: 5 },
];

export const loggedInUser = users[0];

const conditions: ItemCondition[] = ['New', 'Used - Like New', 'Used - Good', 'Needs Minor Repair', 'For Spare Parts'];
const listingTypes: ListingType[] = ['Sell', 'Donate', 'Spare Parts'];

export const items: Item[] = [
  {
    id: 'item-1',
    title: 'Lightly Used Modern Laptop',
    description: '14-inch laptop, great for students. 256GB SSD, 8GB RAM. Only used for a year. Comes with charger.',
    price: 450,
    category: 'Laptops',
    condition: 'Used - Good',
    listingType: 'Sell',
    image: findImage('item-laptop'),
    seller: users[1],
    postedAt: '2 days ago',
    location: 'San Francisco, CA'
  },
  {
    id: 'item-2',
    title: 'Older Smartphone for Donation',
    description: 'Works perfectly fine, just upgraded. Good for a backup phone or for someone in need.',
    price: null,
    category: 'Mobiles',
    condition: 'Used - Good',
    listingType: 'Donate',
    image: findImage('item-phone'),
    seller: users[2],
    postedAt: '5 hours ago',
    location: 'Oakland, CA'
  },
  {
    id: 'item-3',
    title: 'Mechanical Keyboard (for parts)',
    description: 'RGB Mechanical keyboard. Some keys are not responsive, good for spare keycaps and switches.',
    price: 15,
    category: 'Keyboards & Mice',
    condition: 'For Spare Parts',
    listingType: 'Spare Parts',
    image: findImage('item-keyboard'),
    seller: users[0],
    postedAt: '1 week ago',
    location: 'San Francisco, CA'
  },
  {
    id: 'item-4',
    title: 'Vintage 35mm Film Camera',
    description: 'Beautiful vintage camera, fully functional. A great way to get into film photography.',
    price: 120,
    category: 'Cameras',
    condition: 'Used - Good',
    listingType: 'Sell',
    image: findImage('item-camera'),
    seller: users[1],
    postedAt: '3 days ago',
    location: 'Berkeley, CA'
  },
  {
    id: 'item-5',
    title: 'Wireless Over-Ear Headphones',
    description: 'Noise-cancelling headphones, barely used. Excellent sound quality and battery life.',
    price: 80,
    category: 'Audio Devices',
    condition: 'Used - Like New',
    listingType: 'Sell',
    image: findImage('item-headphones'),
    seller: users[2],
    postedAt: '1 day ago',
    location: 'San Mateo, CA'
  },
  {
    id: 'item-6',
    title: 'Quadcopter Drone - Needs Repair',
    description: 'Drone took a small tumble. One propeller arm is cracked, but motors and camera are fine. Good for a tinkerer.',
    price: 50,
    category: 'Other',
    condition: 'Needs Minor Repair',
    listingType: 'Sell',
    image: findImage('item-drone'),
    seller: users[0],
    postedAt: '4 days ago',
    location: 'San Francisco, CA'
  },
  {
    id: 'item-7',
    title: 'Digital Art Tablet',
    description: '10-inch digital drawing tablet with stylus. Perfect for aspiring artists.',
    price: 75,
    category: 'Other',
    condition: 'Used - Like New',
    listingType: 'Sell',
    image: findImage('item-tablet'),
    seller: users[1],
    postedAt: '6 days ago',
    location: 'Palo Alto, CA'
  },
  {
    id: 'item-8',
    title: 'Curved Ultrawide Monitor - Free',
    description: '34-inch ultrawide monitor. Has a small area of dead pixels on the left side, but otherwise works well. Free to a good home!',
    price: null,
    category: 'Monitors',
    condition: 'Needs Minor Repair',
    listingType: 'Donate',
    image: findImage('item-monitor'),
    seller: users[2],
    postedAt: '2 weeks ago',
    location: 'Daly City, CA'
  },
];

export const chats: Chat[] = [
    { id: 'chat-1', user: users[1], lastMessage: "Is this still available?", lastMessageTimestamp: "10m ago", unreadCount: 1 },
    { id: 'chat-2', user: users[2], lastMessage: "Great, I can pick it up tomorrow.", lastMessageTimestamp: "1h ago", unreadCount: 0 },
];

export const messages: ChatMessage[] = [
    { id: 'msg-1', sender: users[1], text: "Hi! I'm interested in the laptop. Is it still available?", timestamp: "12m ago", read: true },
    { id: 'msg-2', sender: 'me', text: "Hey! Yes, it is.", timestamp: "11m ago", read: true },
    { id: 'msg-3', sender: users[1], text: "Great. Would you be open to $400?", timestamp: "10m ago", read: false },
];

export const notifications: Notification[] = [
    { id: 'notif-1', type: 'chat', text: "Jane Smith sent you a new message.", timestamp: "10m ago", isRead: false, href: '/chat' },
    { id: 'notif-2', type: 'status', text: "Your item 'Mechanical Keyboard' was successfully listed.", timestamp: "1h ago", isRead: true, href: '#' },
    { id: 'notif-3', type: 'recycle', text: "Ben Starr marked 'Older Smartphone' as recycled. Please leave a rating!", timestamp: "3h ago", isRead: false, href: '#' },
    { id: 'notif-4', type: 'admin', text: "Welcome to Zwitch! Check out our guide to get started.", timestamp: "1d ago", isRead: true, href: '#' },
];

export const categories = ['Computers', 'Phones', 'Accessories', 'Cameras', 'Audio', 'Drones', 'Monitors', 'Gaming', 'TV & Home Theater'];
