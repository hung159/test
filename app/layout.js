import "./globals.css";

export const metadata = { title: "Mini Shop Dầu Ăn" };

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
