import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-white/70 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm font-display">S</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Selam</span>
            </div>
            <p className="text-sm text-white/60 max-w-xs">
              Premium multilingual mental wellness and health network platform for Ethiopia and East Africa.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/en/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/en/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/en/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Emergency</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-white/60">Police: <span className="text-white">911</span></li>
              <li className="text-white/60">Ambulance: <span className="text-white">907</span></li>
              <li className="text-white/60">Mental Health: <span className="text-white">8722</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
          © {year} Selam Health Platform. Built for East Africa.
        </div>
      </div>
    </footer>
  );
}
