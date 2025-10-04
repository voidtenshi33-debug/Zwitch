import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export function EmptyState({ icon: Icon, title, description, ctaText, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-6">
      <div className="flex flex-col items-center gap-4 text-center p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-headline mt-4 text-2xl font-semibold">{title}</h3>
        <p className="max-w-sm text-muted-foreground">
          {description}
        </p>
        {ctaText && ctaHref && (
            <Button className="mt-4" asChild>
                <Link href={ctaHref}>{ctaText}</Link>
            </Button>
        )}
      </div>
    </div>
  );
}
