import { useEffect, useState } from "react"
import { adminListOrders } from "../../services/admin"
import { formatPrice } from "../../utils/formatPrice"
import type { AdminOrder } from "../../types/order"

const statusStyles: Record<AdminOrder["status"], string> = {
  pending: "text-text-secondary",
  paid: "text-text-primary font-semibold",
  shipped: "text-text-primary font-semibold",
  delivered: "text-text-primary font-semibold",
}

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminListOrders()
      .then(({ orders }) => setOrders(orders))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold">Orders</h1>

      {loading && <p className="mt-6 text-text-secondary">Loading...</p>}
      {error && <p className="mt-6 text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="py-2 pr-4 font-semibold">Order</th>
                <th className="py-2 pr-4 font-semibold">Customer</th>
                <th className="py-2 pr-4 font-semibold">Items</th>
                <th className="py-2 pr-4 font-semibold">Total</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 pr-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border align-top">
                  <td className="py-3 pr-4 font-mono text-xs">{order._id.slice(-8)}</td>
                  <td className="py-3 pr-4">{order.user?.email ?? order.customerEmail ?? "Guest"}</td>
                  <td className="py-3 pr-4">
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.quantity} x {typeof item.product === "object" ? item.product.name : "Item"}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 pr-4">{formatPrice(order.total)}</td>
                  <td className={`py-3 pr-4 capitalize ${statusStyles[order.status]}`}>{order.status}</td>
                  <td className="py-3 pr-4 text-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="mt-6 text-text-secondary">No orders yet.</p>}
        </div>
      )}
    </div>
  )
}
