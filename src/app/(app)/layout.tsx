import { AppShell } from '@/components/layout/app-shell';
import { seedDatabase } from '@/lib/seed';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  seedDatabase(); // This will run once on the server when the app starts
  return <AppShell>{children}</AppShell>;
}
