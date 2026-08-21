import { Route, Routes } from "react-router-dom"
import { RootLayout } from "./components/layout/RootLayout"
import { Account } from "./pages/Account"
import { Cart } from "./pages/Cart"
import { Contact } from "./pages/Contact"
import { Home } from "./pages/Home"
import { Shop } from "./pages/Shop"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="account" element={<Account />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App
