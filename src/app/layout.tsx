import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "o-mohamed-mmb-mcklsdclkd",
  description: "Next.js app with TypeScript and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </div>
      </body>
    </html>
  );
}
