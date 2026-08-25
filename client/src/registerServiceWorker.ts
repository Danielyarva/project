export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return
  if (import.meta.env.DEV) return

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing (unsupported browser, blocked, etc.) shouldn't break the app.
    })
  })
}
