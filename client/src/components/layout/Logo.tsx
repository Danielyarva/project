interface LogoProps {
  showTagline?: boolean
  iconClassName?: string
  wordmarkClassName?: string
  className?: string
}

function MortarPestleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 15c0 6.075 4.477 11 10 11s10-4.925 10-11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="16" cy="15" rx="10" ry="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12.5 6 L22 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="11.5" cy="5" r="2.3" fill="currentColor" />
      <circle cx="22.5" cy="17" r="2" fill="currentColor" />
    </svg>
  )
}

export function Logo({
  showTagline = false,
  iconClassName = "h-6 w-6",
  wordmarkClassName = "text-lg",
  className = "",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <MortarPestleIcon className={`shrink-0 text-accent ${iconClassName}`} />
      <span className="flex flex-col leading-tight">
        <span className={`font-serif font-bold tracking-tight text-text-primary ${wordmarkClassName}`}>
          StoneCraft
        </span>
        {showTagline && (
          <span className="text-[10px] font-semibold tracking-widest text-text-secondary uppercase">
            Handmade. Natural. Timeless.
          </span>
        )}
      </span>
    </span>
  )
}
