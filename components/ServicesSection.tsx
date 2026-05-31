"use client";

import { useEffect, useRef } from "react";

const services = [
  {
    title: "Airport Transfers",
    description: "I track your flight. You land, I am there. No waiting, no haggling.",
    icon: <PlaneIcon />,
    price: "From $35",
  },
  {
    title: "Full Day Trips",
    description: "Secret beaches, hidden villages, places not on any app. Book me for the day.",
    icon: <MapIcon />,
    price: "From $360 / day",
    featured: true,
  },
  {
    title: "Private Shopping",
    description: "The real markets. The good jewelry. The places the hotel concierge never mentions.",
    icon: <ShoppingIcon />,
    price: "$40 / hr",
  },
  {
    title: "Night Out",
    description: "Safe ride for you and your people. I know where the night goes.",
    icon: <NightIcon />,
    price: "$50 / hr",
  },
  {
    title: "Business Transport",
    description: "Professional, punctual, clean car. Arrive ready, not stressed.",
    icon: <BriefcaseIcon />,
    price: "$45 / hr",
  },
  {
    title: "Local Connections",
    description: "Need a doctor, lawyer, builder? I know everyone worth knowing in PV.",
    icon: <PeopleIcon />,
    price: "Ask me",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            ".service-item",
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
              scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
            }
          );
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="section-label mb-4">What I Do</p>
            <h2 className="display-heading text-4xl md:text-5xl">Every kind of ride.</h2>
          </div>
          <a
            href="https://wa.me/523221175350"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline self-start md:self-auto"
          >
            Message Bones
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.title}
              className={`service-item opacity-0 group p-7 rounded-2xl border transition-all duration-200 ${
                s.featured
                  ? "bg-navy text-white border-navy hover:bg-navy/90"
                  : "bg-mist border-black/5 hover:border-black/10 hover:bg-white hover:shadow-sm"
              }`}
            >
              <div className={`mb-5 ${s.featured ? "text-gold" : "text-muted"}`}>
                {s.icon}
              </div>
              <h3 className={`font-semibold text-lg mb-2 ${s.featured ? "text-white" : "text-ink"}`}>
                {s.title}
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${s.featured ? "text-blue-200" : "text-muted"}`}>
                {s.description}
              </p>
              <span className={`text-xs font-semibold uppercase tracking-widest ${s.featured ? "text-gold" : "text-muted"}`}>
                {s.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaneIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>;
}
function MapIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>;
}
function ShoppingIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
}
function NightIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
}
function BriefcaseIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
function PeopleIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
