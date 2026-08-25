import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import { CartSync } from "./components/cart/CartSync.tsx"
import { AuthProvider } from "./context/AuthContext.tsx"
import { CartProvider } from "./context/CartContext.tsx"
import { ThemeProvider } from "./context/ThemeContext.tsx"
import { WishlistProvider } from "./context/WishlistContext.tsx"
import "./index.css"
import { registerServiceWorker } from "./registerServiceWorker.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <CartSync />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

registerServiceWorker()
