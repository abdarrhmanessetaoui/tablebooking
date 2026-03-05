import { cn } from '../../utils/cn'

const VARIANT = {
  primary:
    'bg-accent text-white shadow-soft-md hover:bg-accent/90 active:bg-accent/85 disabled:bg-accent/60 disabled:shadow-none',
  secondary:
    'bg-surface text-ink border border-border/80 hover:bg-bg active:bg-bg/80 disabled:text-muted disabled:bg-surface/60',
  ghost: 'bg-transparent text-ink hover:bg-bg active:bg-bg/80 disabled:text-muted',
  danger:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-600/90 disabled:bg-red-600/60',
}

const SIZE = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-11 px-5 text-sm rounded-xl',
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-ring disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  )
}

