import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-serif text-white text-2xl font-bold mb-3">Bones PV</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Private driver and local guide in Puerto Vallarta.
              15 years of knowing where to go and who to call.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-5 uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Airport Transfers", "Day Trips", "Night Out", "Shopping", "Business"].map((s) => (
                <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-5 uppercase tracking-widest">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://wa.me/523221175350" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="tel:+523221175350" className="hover:text-white transition-colors">+52 322 117 5350</a></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><a href="#rates" className="hover:text-white transition-colors">Rates</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-600">
          <span>&copy; {year} Bones — Puerto Vallarta Private Driver</span>
          <span>Puerto Vallarta, Jalisco, Mexico</span>
        </div>
      </div>
    </footer>
  );
}
