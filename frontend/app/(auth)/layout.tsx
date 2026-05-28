import AuthBackground from "@/components/auth/AuthBackground";
import { Box } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex selection:bg-packiq-blue/30 selection:text-white">
      {/* 3D Background on the left half (hidden on mobile) */}
      <div className="hidden w-1/2 lg:block relative">
        <AuthBackground />
        
        {/* Logo overlay on the background */}
        <div className="absolute top-8 left-8 z-10 flex items-center space-x-2">
          <Box className="h-8 w-8 text-packiq-blue" />
          <span className="font-heading text-2xl font-bold text-white">PackIQ</span>
        </div>
        
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <h1 className="font-heading text-4xl font-bold text-white leading-tight mb-4">
            Optimize your packaging,<br />
            <span className="text-packiq-cyan">minimize your footprint.</span>
          </h1>
          <p className="text-gray-400 max-w-md text-lg">
            Join the next generation of logistics platforms powered by advanced AI and spatial computing.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-1/2 lg:px-20 xl:px-32 bg-packiq-dark relative z-10">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 flex items-center space-x-2 lg:hidden">
          <Box className="h-8 w-8 text-packiq-blue" />
          <span className="font-heading text-2xl font-bold text-white">PackIQ</span>
        </div>
        
        <div className="flex flex-col items-center">
          {children}
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} PackIQ. All rights reserved.
        </div>
      </div>
    </div>
  );
}
