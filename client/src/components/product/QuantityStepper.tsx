import { Minus, Plus } from "lucide-react"

interface QuantityStepperProps {
  quantity: number
  onChange: (quantity: number) => void
  max?: number
}

export function QuantityStepper({ quantity, onChange, max }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-border px-3 py-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(max ? Math.min(max, quantity + 1) : quantity + 1)}
        disabled={max !== undefined && quantity >= max}
        className="disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
