import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Bones PV | Secret Beaches & Local Tips",
  description:
    "Stories, tips, and hidden spots from a Puerto Vallarta local. Bones writes about the places tourists don't find.",
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-xl text-ink">Bones PV</Link>
          <a
            href="https://wa.me/523221175350"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2.5 px-5"
          >
            Book a Ride
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="mb-16">
          <p className="section-label mb-4">From Bones</p>
          <h1 className="display-heading text-5xl md:text-6xl mb-6">
            The places I love.
          </h1>
          <p className="text-muted text-xl max-w-xl">
            Real stories about real places in Puerto Vallarta.
            Written by someone who was born here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="card overflow-hidden h-full flex flex-col">
                <div className="aspect-[16/9] bg-gradient-to-br from-navy to-navy/70 relative">
                  <div className="absolute inset-0 flex items-end p-5">
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
                  <h2 className="font-serif text-xl font-bold text-ink mb-3 group-hover:text-navy transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-muted text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
