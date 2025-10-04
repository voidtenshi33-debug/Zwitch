import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isDashboard?: boolean;
  as?: React.ElementType;
}

export function Logo({ className, isDashboard = false, as: Component = Link }: LogoProps) {
  const href = isDashboard ? '/dashboard' : '/';
  
  if (Component === 'span') {
    return (
      <span className={cn("font-headline text-3xl font-bold text-primary", className)}>
        Zwitch
      </span>
    );
  }

  return (
    <Link href={href} className={cn("font-headline text-3xl font-bold text-primary transition-colors hover:text-primary/80", className)}>
      Zwitch
    </Link>
  );
}
