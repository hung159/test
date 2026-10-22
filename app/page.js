import { prisma } from "../lib/prisma";
import OrderForm from "./OrderForm";

export const dynamic = "force-dynamic"; // luôn đọc dữ liệu mới từ DB

const vnd = (n) => n.toLocaleString("vi-VN") + "đ";

export default async function Home() {
  // Server Component: chạy ở backend, đọc thẳng từ Neon
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { product: true },
  });

  return (
    <main>
      <h1>Mini Shop Dầu Ăn</h1>

      <h2>Sản phẩm</h2>
      {products.length === 0 && <p>Chưa có sản phẩm. Chạy: npx prisma db seed</p>}
      {products.map((p) => (
        <div className="card" key={p.id}>
          {p.name} — <b>{vnd(p.price)}</b>
        </div>
      ))}

      <h2>Đặt hàng</h2>
      <OrderForm products={products} />

      <h2>10 đơn gần nhất</h2>
      {orders.map((o) => (
        <div className="card" key={o.id}>
          #{o.id} — {o.customerName} ({o.phone}) — {o.product.name} x{o.quantity} ={" "}
          <b>{vnd(o.total)}</b>
        </div>
      ))}
    </main>
  );
}
