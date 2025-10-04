import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isDashboard?: boolean;
}

export function Logo({ className, isDashboard = false }: LogoProps) {
  const href = isDashboard ? '/dashboard' : '/';
  return (
    <Link href={href} className={cn("font-headline text-3xl font-bold text-primary transition-colors hover:text-primary/80", className)}>
      Zwitch
    </Link>
  );
}
