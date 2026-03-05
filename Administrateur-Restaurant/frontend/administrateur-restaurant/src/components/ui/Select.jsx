import { cn } from '../../utils/cn'

export default function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink shadow-sm',
        'focus-ring',
        className,
      )}
      {...props}
    />
  )
}

