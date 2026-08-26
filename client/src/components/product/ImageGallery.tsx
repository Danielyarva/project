import { useState } from "react"

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-card bg-surface shadow-card">
        <img
          src={images[activeIndex]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                index === activeIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
