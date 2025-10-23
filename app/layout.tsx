import "./globals.css";
export const metadata = {
  title: "RRR – Simple Send",
  description: "Email or SMS in one form. No guards.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
