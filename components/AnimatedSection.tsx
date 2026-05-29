"use client";

import { useEffect, useRef } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";
  delay?: number;
}

/**
 * Wrapper that applies a GSAP ScrollTrigger fade/slide animation
 * when the section enters the viewport.
 */
export default function AnimatedSection({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const fromVars: gsap.TweenVars = { opacity: 0 };
        switch (animation) {
          case "fadeUp":
            fromVars.y = 40;
            break;
          case "slideLeft":
            fromVars.x = -40;
            break;
          case "slideRight":
            fromVars.x = 40;
            break;
        }

        ctx = gsap.context(() => {
          gsap.fromTo(ref.current, fromVars, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              once: true,
            },
          });
        });
      });
    });

    return () => ctx?.revert();
  }, [animation, delay]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
