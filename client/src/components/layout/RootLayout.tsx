import { useState } from "react"
import { Outlet } from "react-router-dom"
import { BottomTabBar } from "./BottomTabBar"
import { Footer } from "./Footer"
import { HamburgerDrawer } from "./HamburgerDrawer"
import { MobileHeader } from "./MobileHeader"
import { Navbar } from "./Navbar"

export function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-bg text-text-primary">
      <Navbar />
      <MobileHeader onOpenMenu={() => setDrawerOpen(true)} />
      <HamburgerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  )
}
