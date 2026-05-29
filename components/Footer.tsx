export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-white font-serif text-xl font-bold mb-3">Bones</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Private driver in Puerto Vallarta. 15+ years experience.
              Safe, reliable, fair prices.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:+523221175350"
                  className="hover:text-white transition-colors"
                >
                  +52 322 117 5350
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/523221175350"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["services", "about", "rates", "booking"].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="hover:text-white transition-colors capitalize"
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          &copy; {year} Bones — Puerto Vallarta Private Driver. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
