import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-bg p-1">
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => option !== theme && toggleTheme()}
          aria-pressed={theme === option}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            theme === option
              ? "bg-accent text-accent-text"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {option === "light" ? <Sun size={14} /> : <Moon size={14} />}
          {option === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  )
}
