import { Smartphone, Laptop, Keyboard, Monitor, Cable, Headphones, Cpu, Package, LucideIcon } from "lucide-react";

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
  { id: 8, name: 'Other', icon: Package, slug: 'other' },
];
