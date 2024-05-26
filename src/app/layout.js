import { Lexend } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata = {
  title: "Course Crafter",
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
            <Toaster/>
        </Providers>
        
      </body>
    </html>
  );
}
