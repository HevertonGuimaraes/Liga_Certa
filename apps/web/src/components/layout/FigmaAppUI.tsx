import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function FigmaPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-liga-panel/60 p-6 backdrop-blur sm:p-8', className)}>
      {children}
    </div>
  );
}

export function FigmaErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 font-display text-sm text-red-200">
      {message}
    </div>
  );
}

export function FigmaFormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-display text-lg font-semibold text-white sm:text-xl">{label}</label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function FigmaInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="liga-input-dark" {...props} />;
}

export function FigmaSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="liga-input-dark appearance-none"
      {...props}
    />
  );
}

export function FigmaTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="liga-input-dark min-h-[120px] resize-y" {...props} />;
}

export function FigmaFormActions({
  onCancel,
  submitLabel,
  loading,
}: {
  onCancel: () => void;
  submitLabel: string;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-white/20 px-6 py-3 font-display text-base font-semibold text-white transition hover:bg-white/10"
      >
        Cancelar
      </button>
      <button type="submit" disabled={loading} className="liga-btn-primary flex-1 disabled:opacity-60">
        {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : submitLabel}
      </button>
    </div>
  );
}

export function FigmaTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-liga-card/80">
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  );
}

export function FigmaTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-white/10 bg-liga-navy-deep/80 font-display text-white/80">{children}</tr>
    </thead>
  );
}

export function FigmaTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="font-display text-white">{children}</tbody>;
}

export function FigmaTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-white/5 transition hover:bg-white/5">{children}</tr>;
}

export function FigmaTableCell({
  children,
  className,
  header,
}: {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}) {
  const Tag = header ? 'th' : 'td';
  return (
    <Tag className={cn('px-4 py-3', header && 'text-left font-semibold', className)}>
      {children}
    </Tag>
  );
}

export function FigmaEmptyPanel({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <FigmaPanel className="text-center">
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 font-display text-white/60">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="liga-btn-primary mt-6 inline-flex">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button type="button" onClick={onAction} className="liga-btn-primary mt-6 inline-flex">
          {actionLabel}
        </button>
      )}
    </FigmaPanel>
  );
}

export function FigmaListCard({
  title,
  subtitle,
  meta,
  actionLabel,
  actionTo,
  onClick,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  actionLabel?: string;
  actionTo?: string;
  onClick?: () => void;
}) {
  const content = (
    <article className="liga-card-championship transition hover:ring-1 hover:ring-liga-blue/40">
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      {subtitle && <p className="mt-2 font-display text-sm font-semibold text-liga-blue-dark">{subtitle}</p>}
      {meta && <p className="mt-1 font-display text-sm text-white/60">{meta}</p>}
      {actionLabel && (
        <span className="mt-4 inline-block font-display text-sm font-semibold text-liga-blue">{actionLabel}</span>
      )}
    </article>
  );

  if (actionTo) return <Link to={actionTo}>{content}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className="w-full text-left">{content}</button>;
  return content;
}

export function FigmaBadge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'live' | 'finished' }) {
  const styles = {
    default: 'bg-liga-panel text-white/80',
    live: 'bg-green-500/20 text-green-300',
    finished: 'bg-liga-blue/20 text-liga-blue',
  };
  return (
    <span className={cn('inline-flex rounded-lg px-3 py-1 font-display text-xs font-semibold uppercase', styles[variant])}>
      {children}
    </span>
  );
}
