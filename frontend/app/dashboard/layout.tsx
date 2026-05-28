import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | PackIQ",
  description: "Your packaging analytics and optimization hub",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-packiq-dark text-white selection:bg-packiq-blue/30 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col lg:pl-64 h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-black p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
