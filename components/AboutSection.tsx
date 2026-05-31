"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const connections = [
  "Doctors who speak English and actually listen",
  "Lawyers who handle foreigner real estate without disappearing",
  "Builders I would trust with my own house",
  "Restaurants cooking for locals, not tourists",
  "The fish market, the mezcal guys, the best tacos at midnight",
];

export default function AboutSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(textRef.current, { opacity: 0, x: -30 }, {
            opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: textRef.current, start: "top 80%", once: true },
          });
          gsap.fromTo(imageRef.current, { opacity: 0, x: 30 }, {
            opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: imageRef.current, start: "top 80%", once: true },
          });
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section id="about" className="py-28 bg-sand">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Image */}
          <div ref={imageRef} className="opacity-0 order-2 lg:order-1">
            <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0">
              <Image
                src="/bones.jpg"
                alt="Bones — Puerto Vallarta local and private driver"
                fill
                className="object-cover rounded-3xl"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5" />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="opacity-0 order-1 lg:order-2">
            <p className="section-label mb-6">About Bones</p>
            <h2 className="display-heading text-4xl md:text-5xl mb-8">
              Not a company.
              <br />
              <span className="italic text-gold">A person.</span>
            </h2>

            <div className="space-y-4 text-gray-600 text-lg leading-relaxed mb-10">
              <p>
                I was born here. I grew up on these streets. I started driving
                family and friends around because I knew where to go — and word
                spread from there.
              </p>
              <p>
                Over 15 years I have built something that no GPS can replicate:
                I know everyone worth knowing in Puerto Vallarta.
                That matters more than you might expect.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-black/5 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">
                People I can connect you with
              </p>
              <ul className="space-y-3">
                {connections.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://wa.me/523221175350?text=Hi%20Bones%2C%20I%27d%20love%20to%20learn%20more"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Say hello on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
