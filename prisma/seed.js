const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { name: "Dầu đậu nành 1L", price: 45000 },
      { name: "Dầu hướng dương 1L", price: 68000 },
      { name: "Dầu olive 500ml", price: 150000 },
    ],
  });
  console.log("Seed xong");
}
main().finally(() => prisma.$disconnect());
