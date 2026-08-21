function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2)
  return initials.toUpperCase()
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-text font-bold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(name)}
    </div>
  )
}
