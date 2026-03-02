import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "XD Platform - Browse & Download Games",
  description: "Discover and download amazing games for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased min-h-screen flex flex-col'>
        <AuthProvider>
          <Header />
          <main className='flex-grow container mx-auto px-4 py-8'>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
