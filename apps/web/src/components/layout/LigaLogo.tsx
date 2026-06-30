import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface LigaLogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  textClassName?: string;
  to?: string;
}

export function LigaLogo({
  className,
  imageClassName,
  showText = false,
  textClassName,
  to = '/',
}: LigaLogoProps) {
  const content = (
    <>
      <img
        src="/logo.png"
        alt="Liga Certa"
        className={cn('h-10 w-auto object-contain sm:h-12', imageClassName)}
      />
      {showText && (
        <span className={cn('font-display text-xl font-semibold text-white', textClassName)}>
          Liga Certa
        </span>
      )}
    </>
  );

  return (
    <Link to={to} className={cn('inline-flex items-center gap-3', className)}>
      {content}
    </Link>
  );
}
