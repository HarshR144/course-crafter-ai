import { Lexend } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const lexend = Lexend({ subsets: ["latin"] });
export const metadata = {
  title: "Course Crafter AI",
  description: "Get a structured course on topics you want to explore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn(lexend.className,' antialiased min-h-screen pt-16')}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
            <Navbar/>
            {children}
        </Providers>
        <Toaster/>
        
      </body>
    </html>
  );
}
