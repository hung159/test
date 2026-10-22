"use client"; // Client Component: chạy trên trình duyệt (Frontend)

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderForm({ products }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = new FormData(e.target);

    // Frontend gọi Backend (API route)
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: f.get("customerName"),
        phone: f.get("phone"),
        productId: Number(f.get("productId")),
        quantity: Number(f.get("quantity")),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Có lỗi xảy ra");
      return;
    }
    e.target.reset();
    router.refresh(); // tải lại dữ liệu từ DB
  }

  return (
    <form onSubmit={submit}>
      <input name="customerName" placeholder="Tên của bạn" required />
      <input name="phone" placeholder="Số điện thoại" required />
      <select name="productId">
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input name="quantity" type="number" min="1" max="99" defaultValue="1" />
      <button disabled={loading}>{loading ? "Đang gửi..." : "Đặt hàng"}</button>
      {error && <p className="err">{error}</p>}
    </form>
  );
}
