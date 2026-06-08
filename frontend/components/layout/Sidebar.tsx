"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, Package, Settings, LogOut, ShoppingCart, Leaf } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await auth?.signOut();
      logout();
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Optimization", href: "/dashboard/optimization", icon: <Box className="h-5 w-5" /> },
    { name: "Orders", href: "/dashboard/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Box Catalog", href: "/dashboard/box-catalog", icon: <Package className="h-5 w-5" /> },
    { name: "Sustainability", href: "/dashboard/sustainability", icon: <Leaf className="h-5 w-5" /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-packiq-dark lg:flex shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Shipzi Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold text-white tracking-wide leading-tight">Shipzi</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest leading-none">powered by terybi</span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-packiq-blue/10 text-packiq-blue border border-packiq-blue/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className={`${isActive ? "text-packiq-blue" : "text-gray-400 group-hover:text-white"} transition-colors`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-white/10 p-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
