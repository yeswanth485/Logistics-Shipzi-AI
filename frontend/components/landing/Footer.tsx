import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center space-x-2">
              <img src="/logo.png" alt="Shipzi" className="h-8 w-8 rounded-md" />
              <span className="font-heading text-2xl font-bold text-white">Shipzi</span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">powered by terybi</p>
            <p className="mb-6 text-sm text-gray-500">
              Premium AI-powered logistics and packaging optimization platform.
            </p>
            <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-packiq-cyan opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-packiq-cyan"></span>
              </span>
              <span>Powered by AI</span>
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 font-bold text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-packiq-cyan">Optimization Engine</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Analytics</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Box Catalog</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Sustainability</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-packiq-cyan">Documentation</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">API Reference</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Case Studies</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-bold text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-packiq-cyan">About</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Careers</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Contact</Link></li>
              <li><Link href="#" className="hover:text-packiq-cyan">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Shipzi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
