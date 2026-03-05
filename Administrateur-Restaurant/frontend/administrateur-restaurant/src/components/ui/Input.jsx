import { cn } from '../../utils/cn'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink placeholder:text-muted/70 shadow-sm',
        'focus-ring',
        'disabled:bg-surface/60 disabled:text-muted disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

