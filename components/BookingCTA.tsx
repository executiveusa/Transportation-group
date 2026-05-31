"use client";

import { useEffect, useRef, useState } from "react";

const WHATSAPP_LINK =
  "https://wa.me/523221175350?text=Hi%20Bones%2C%20I%27d%20like%20to%20book%20a%20ride";

export default function BookingCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(sectionRef.current, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      setSent(true);
    } catch {
      // Fail gracefully
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="booking" ref={sectionRef} className="py-28 bg-navy text-white opacity-0">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left — CTA */}
          <div>
            <p className="section-label text-blue-400 mb-6">Book Bones</p>
            <h2 className="display-heading text-white text-4xl md:text-5xl mb-6">
              Ready to see
              <br />
              the real PV?
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-10">
              Message me on WhatsApp and I will get back to you within minutes.
              Tell me what you want — I will build the day around it.
            </p>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mb-6 inline-flex"
              onClick={() =>
                fetch("/api/analytics", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ eventType: "whatsapp_click", page: "booking_cta" }),
                }).catch(() => {})
              }
            >
              <WhatsAppIcon />
              Open WhatsApp
            </a>

            <p className="text-blue-400 text-sm">
              +52 322 117 5350 &bull; Available 24/7 &bull; English &amp; Spanish
            </p>
          </div>

          {/* Right — Contact form (backup) */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckIcon />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">Got it.</h3>
                <p className="text-blue-200">
                  Bones will see your message and reach out directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-white font-semibold text-lg mb-6">
                  Or leave a message
                </h3>
                <div>
                  <label className="text-blue-300 text-xs font-medium uppercase tracking-widest block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-400/50 focus:outline-none focus:border-white/30 transition-colors text-sm"
                    placeholder="First name is fine"
                  />
                </div>
                <div>
                  <label className="text-blue-300 text-xs font-medium uppercase tracking-widest block mb-2">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-400/50 focus:outline-none focus:border-white/30 transition-colors text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="text-blue-300 text-xs font-medium uppercase tracking-widest block mb-2">
                    What do you need?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-400/50 focus:outline-none focus:border-white/30 transition-colors text-sm resize-none"
                    placeholder="Day trip, airport pickup, whatever you need..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white text-navy font-semibold py-3.5 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 text-sm"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
