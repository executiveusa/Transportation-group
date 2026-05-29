"use client";

import { useEffect, useRef } from "react";

const rates = [
  {
    service: "Airport Transfer",
    price: "$35 – $50",
    note: "Depending on your location",
  },
  {
    service: "Hourly Rate",
    price: "$45 / hr",
    note: "2-hour minimum",
  },
  {
    service: "Full Night Out",
    price: "$50 / hr",
    note: "4-hour minimum recommended",
  },
  {
    service: "Shopping Tour",
    price: "$40 / hr",
    note: "",
  },
];

const cancellationPolicy = [
  { timing: "Cancel 24+ hours before", charge: "Full refund" },
  { timing: "Cancel 4–12 hours before", charge: "50% charge" },
  { timing: "Cancel less than 4 hours before", charge: "100% charge" },
  {
    timing: "Bookings of 4+ hours",
    charge: "20% retention fee if canceled",
  },
];

export default function RatesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            sectionRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section id="rates" ref={sectionRef} className="py-24 bg-gray-50 opacity-0">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fair Pricing
          </h2>
          <p className="text-gray-500 text-lg">
            No hidden fees. No surprises. What you see is what you pay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Rates table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#0f2744] px-6 py-4">
              <h3 className="text-white font-semibold text-lg">Service Rates</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {rates.map((rate) => (
                <div key={rate.service} className="flex items-center justify-between px-6 py-5">
                  <div>
                    <p className="font-medium text-gray-900">{rate.service}</p>
                    {rate.note && (
                      <p className="text-gray-500 text-sm mt-0.5">{rate.note}</p>
                    )}
                  </div>
                  <span className="text-brand-red font-bold text-lg whitespace-nowrap ml-4">
                    {rate.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation policy */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-brand-red px-6 py-4">
              <h3 className="text-white font-semibold text-lg">
                Cancellation Policy
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {cancellationPolicy.map((policy) => (
                <div
                  key={policy.timing}
                  className="flex items-start justify-between px-6 py-5 gap-4"
                >
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {policy.timing}
                  </p>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      policy.charge === "Full refund"
                        ? "text-green-600"
                        : "text-brand-red"
                    }`}
                  >
                    {policy.charge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          All prices in USD. Message on WhatsApp for a custom quote.
        </p>
      </div>
    </section>
  );
}
