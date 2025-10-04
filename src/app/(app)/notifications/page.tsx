import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bell, MessageSquare, BadgeCheck, ShieldAlert } from 'lucide-react';

const notificationIcons = {
  chat: MessageSquare,
  status: Bell,
  recycle: BadgeCheck,
  admin: ShieldAlert,
};

// This would be replaced with real data from Firestore
const allNotifications = [
    { id: 'notif-1', type: 'chat', text: "Anjali Sharma sent you a new message.", timestamp: "10m ago", isRead: false, href: '/chat' },
    { id: 'notif-2', type: 'status', text: "Your item 'Logitech Mechanical Gaming Keyboard' was successfully listed.", timestamp: "1h ago", isRead: true, href: '#' },
    { id: 'notif-3', type: 'recycle', text: "Anjali Sharma marked 'iPhone X' as recycled. Please leave a rating!", timestamp: "3h ago", isRead: false, href: '#' },
    { id: 'notif-4', type: 'admin', text: "Welcome to Zwitch! Check out our guide to get started.", timestamp: "1d ago", isRead: true, href: '#' },
];


export default function NotificationsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
            <CardDescription>Here are your latest updates from Zwitch.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    className="block rounded-lg transition-colors hover:bg-muted"
                  >
                    <div className={cn("flex items-start gap-4 p-4 border-l-4", 
                      !notification.isRead ? "border-primary bg-muted/50" : "border-transparent"
                    )}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{notification.text}</p>
                        <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
                      </div>
                       {!notification.isRead && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
