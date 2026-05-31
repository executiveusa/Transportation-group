"use client";

import { useEffect, useRef } from "react";

const rates = [
  { service: "Airport Transfer", price: "$35 – $50", note: "I track your flight" },
  { service: "Full Day Trip", price: "$360+", note: "8 hrs · secret beaches, villages", featured: true },
  { service: "Hourly", price: "$45 / hr", note: "2-hour minimum" },
  { service: "Night Out", price: "$50 / hr", note: "4-hour minimum" },
  { service: "Shopping Tour", price: "$40 / hr", note: "" },
];

const policy = [
  { timing: "Cancel 24+ hours before", charge: "Full refund", ok: true },
  { timing: "Cancel 4–12 hours before", charge: "50% charge", ok: false },
  { timing: "Cancel less than 4 hours", charge: "100% charge", ok: false },
  { timing: "Bookings of 4+ hours", charge: "20% retention if canceled", ok: false },
];

export default function RatesSection() {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section id="rates" ref={sectionRef} className="py-28 bg-sand opacity-0">
      <div className="max-w-5xl mx-auto px-8">
        <div className="mb-16">
          <p className="section-label mb-4">Pricing</p>
          <h2 className="display-heading text-4xl md:text-5xl">
            Fair prices.
            <br />
            <span className="italic">No surprises.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rates */}
          <div className="bg-white rounded-3xl overflow-hidden border border-black/5">
            <div className="px-8 py-5 border-b border-black/5">
              <h3 className="font-semibold text-ink">Service Rates</h3>
            </div>
            {rates.map((r) => (
              <div
                key={r.service}
                className={`flex items-center justify-between px-8 py-5 border-b border-black/5 last:border-0 ${r.featured ? "bg-navy/3" : ""}`}
              >
                <div>
                  <p className={`font-medium ${r.featured ? "text-navy font-semibold" : "text-ink"}`}>
                    {r.service}
                    {r.featured && <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">Popular</span>}
                  </p>
                  {r.note && <p className="text-muted text-xs mt-0.5">{r.note}</p>}
                </div>
                <span className={`font-bold whitespace-nowrap ml-4 ${r.featured ? "text-navy" : "text-ink"}`}>
                  {r.price}
                </span>
              </div>
            ))}
          </div>

          {/* Cancellation */}
          <div className="bg-white rounded-3xl overflow-hidden border border-black/5">
            <div className="px-8 py-5 border-b border-black/5">
              <h3 className="font-semibold text-ink">Cancellation Policy</h3>
            </div>
            {policy.map((p) => (
              <div key={p.timing} className="flex items-start justify-between px-8 py-5 border-b border-black/5 last:border-0 gap-4">
                <p className="text-gray-600 text-sm leading-relaxed">{p.timing}</p>
                <span className={`text-sm font-semibold whitespace-nowrap ${p.ok ? "text-green-600" : "text-red-500"}`}>
                  {p.charge}
                </span>
              </div>
            ))}
            <div className="px-8 py-5 bg-mist">
              <p className="text-muted text-xs leading-relaxed">
                All prices USD. Message for custom quotes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
