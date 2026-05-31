"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const posts = getPublishedPosts().slice(0, 3);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(".blog-card", { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          });
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section id="blog" ref={sectionRef} className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="section-label mb-4">From Bones</p>
            <h2 className="display-heading text-4xl md:text-5xl">
              The places I love.
              <br />
              <span className="italic">In my own words.</span>
            </h2>
          </div>
          <Link href="/blog" className="btn-outline self-start">
            All posts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card opacity-0 group block"
            >
              <article className="card overflow-hidden h-full flex flex-col">
                {/* Placeholder image area */}
                <div className="aspect-[16/9] bg-gradient-to-br from-navy to-navy/80 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-xl font-bold text-ink mb-3 group-hover:text-navy transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-xs">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-muted">{post.readingMinutes} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
