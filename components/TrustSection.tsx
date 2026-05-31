"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Years in PV", decimal: false },
  { value: 500, suffix: "+", label: "Rides completed", decimal: false },
  { value: 4.9, suffix: "", label: "Average rating", decimal: true },
  { value: 24, suffix: "/7", label: "Available", decimal: false },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let animated = false;
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(".stat-block", { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
            onEnter() {
              if (animated) return;
              animated = true;
              stats.forEach((stat, i) => {
                const el = countersRef.current[i];
                if (!el) return;
                const obj = { val: 0 };
                gsap.to(obj, {
                  val: stat.value,
                  duration: 1.8,
                  ease: "power2.out",
                  onUpdate() {
                    el.textContent = stat.decimal
                      ? obj.val.toFixed(1)
                      : Math.round(obj.val).toString();
                  },
                  onComplete() {
                    el.textContent = stat.decimal
                      ? stat.value.toFixed(1)
                      : stat.value.toString();
                  },
                });
              });
            },
          });
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-black/5">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-block opacity-0 text-center lg:px-8">
              <div className="font-serif text-5xl md:text-6xl font-bold text-ink mb-2">
                <span ref={(el) => { countersRef.current[i] = el; }}>0</span>
                <span className="text-gold">{stat.suffix}</span>
              </div>
              <p className="text-muted text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
