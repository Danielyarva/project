import { Navigate, Route, Routes } from "react-router-dom"
import { AdminRoute } from "./components/admin/AdminRoute"
import { RootLayout } from "./components/layout/RootLayout"
import { Account } from "./pages/Account"
import { AdminContactMessages } from "./pages/admin/AdminContactMessages"
import { AdminLayout } from "./pages/admin/AdminLayout"
import { AdminOrders } from "./pages/admin/AdminOrders"
import { AdminProductForm } from "./pages/admin/AdminProductForm"
import { AdminProducts } from "./pages/admin/AdminProducts"
import { Cart } from "./pages/Cart"
import { Contact } from "./pages/Contact"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { NotFound } from "./pages/NotFound"
import { OrderConfirmation } from "./pages/OrderConfirmation"
import { ProductDetail } from "./pages/ProductDetail"
import { Register } from "./pages/Register"
import { Shop } from "./pages/Shop"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="account" element={<Account />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="contact-messages" element={<AdminContactMessages />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
