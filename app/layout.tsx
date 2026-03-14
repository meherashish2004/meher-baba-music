import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomPlayer from "@/src/components/BottomPlayer";
import Sidebar from "@/src/components/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meher Baba Music",
  description: "Devotional songs and bhajans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* We use h-screen and overflow-hidden to lock the app frame */}
      <body className={`${inter.className} bg-black text-white h-screen overflow-hidden flex flex-col`}>
        
        {/* Main App Area: Sidebar + Page Content */}
        <div className="flex flex-1 overflow-hidden pb-24">
          <Sidebar />
          
          {/* Main Content Area (Home, Search, etc.) */}
          <main className="flex-1 overflow-y-auto bg-slate-950 md:bg-slate-900 md:rounded-tl-2xl md:mt-2 md:border-t md:border-l border-slate-800">
            {children}
          </main>
        </div>
        
        {/* The Global Player stays locked to the bottom */}
        <BottomPlayer />
        
      </body>
    </html>
  );
}