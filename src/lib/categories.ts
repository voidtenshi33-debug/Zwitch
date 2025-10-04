import { Smartphone, Laptop, Keyboard, Monitor, Cable, Headphones, Cpu, Package, LucideIcon, Gamepad2, Webcam } from "lucide-react";

export type Category = {
  id: number;
  name: string;
  icon: LucideIcon;
  slug: string;
};

export const categories: Category[] = [
  { id: 1, name: 'Mobiles', icon: Smartphone, slug: 'mobiles' },
  { id: 2, name: 'Laptops', icon: Laptop, slug: 'laptops' },
  { id: 3, name: 'Keyboards & Mice', icon: Keyboard, slug: 'keyboards-mice' },
  { id: 4, name: 'Monitors', icon: Monitor, slug: 'monitors' },
  { id: 5, name: 'Chargers & Cables', icon: Cable, slug: 'chargers-cables' },
  { id: 6, name: 'Audio Devices', icon: Headphones, slug: 'audio-devices' },
  { id: 7, name: 'Components', icon: Cpu, slug: 'components' },
  { id: 8, name: 'Gaming Consoles', icon: Gamepad2, slug: 'gaming-consoles' },
  { id: 9, name: 'Cameras & Webcams', icon: Webcam, slug: 'cameras-webcams' },
  { id: 10, name: 'Other Electronics', icon: Package, slug: 'other-electronics' },
];
