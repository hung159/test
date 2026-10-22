import { prisma } from "../../../lib/prisma";

// Backend: nhận đơn từ frontend, kiểm tra, rồi lưu vào Neon
export async function POST(req) {
  const body = await req.json().catch(() => null);

  const customerName = String(body?.customerName || "").trim();
  const phone = String(body?.phone || "").trim();
  const productId = Number(body?.productId);
  const quantity = Number(body?.quantity);

  // Không tin dữ liệu từ client: luôn kiểm tra ở server
  if (customerName.length < 2 || customerName.length > 80)
    return Response.json({ error: "Tên không hợp lệ" }, { status: 400 });
  if (!/^0\d{9}$/.test(phone))
    return Response.json({ error: "SĐT phải gồm 10 số, bắt đầu bằng 0" }, { status: 400 });
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
    return Response.json({ error: "Số lượng từ 1 đến 99" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return Response.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });

  // Giá lấy từ DB, KHÔNG lấy từ client (tránh bị sửa giá)
  const order = await prisma.order.create({
    data: { customerName, phone, productId, quantity, total: product.price * quantity },
  });

  return Response.json(order, { status: 201 });
}

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return Response.json(orders);
}
