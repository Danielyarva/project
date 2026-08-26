import { useEffect } from "react"

interface SeoOptions {
  title: string
  description: string
  image?: string
  jsonLd?: object
  noIndex?: boolean
}

const SITE_NAME = "StoneCraft"
const DEFAULT_IMAGE = "/favicon.svg"

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

export function useSeo({ title, description, image = DEFAULT_IMAGE, jsonLd, noIndex = false }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    document.title = fullTitle

    upsertMeta("name", "description", description)
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow")
    upsertMeta("property", "og:title", fullTitle)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:image", image)
    upsertMeta("property", "og:type", "website")
    upsertMeta("property", "og:site_name", SITE_NAME)
    upsertMeta("name", "twitter:card", "summary_large_image")

    let script: HTMLScriptElement | null = null
    if (jsonLd) {
      script = document.createElement("script")
      script.type = "application/ld+json"
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      if (script) document.head.removeChild(script)
    }
  }, [title, description, image, jsonLd, noIndex])
}
