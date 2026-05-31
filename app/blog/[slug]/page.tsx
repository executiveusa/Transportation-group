import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPost, getPublishedPosts } from "@/lib/blog";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Bones PV`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  // Convert plain text content to simple HTML paragraphs
  const renderedContent = post.content
    .split("\n\n")
    .map((block, i) => {
      if (block.startsWith("**") && block.endsWith("**")) {
        return `<h2>${block.slice(2, -2)}</h2>`;
      }
      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((l) => l.startsWith("- "))
          .map((l) => `<li>${l.slice(2)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${block.trim()}</p>`;
    })
    .join("");

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <header className="border-b border-black/5 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-xl text-ink">Bones PV</Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-muted text-sm hover:text-ink transition-colors">
              All posts
            </Link>
            <a
              href="https://wa.me/523221175350?text=Hi%20Bones%2C%20I%20read%20your%20blog%20and%20want%20to%20book%20a%20trip"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-5"
            >
              Book This Trip
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-16">
        {/* Meta */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-sand text-muted text-xs px-3 py-1 rounded-full border border-black/5">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="display-heading text-3xl md:text-4xl lg:text-5xl mb-6 leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-muted text-sm">
            <span className="font-semibold text-ink">Bones</span>
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

        {/* Cover image placeholder */}
        <div className="aspect-[16/7] bg-gradient-to-br from-navy to-navy/60 rounded-2xl mb-12" />

        {/* Content */}
        <div
          className="prose-bones"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

        {/* CTA */}
        <div className="mt-16 bg-navy rounded-3xl p-10 text-center">
          <h3 className="font-serif text-white text-2xl font-bold mb-3">
            Want to go?
          </h3>
          <p className="text-blue-200 mb-7">
            Message Bones on WhatsApp and he will plan the day.
          </p>
          <a
            href={`https://wa.me/523221175350?text=Hi%20Bones%2C%20I%20read%20about%20${encodeURIComponent(post.title)}%20and%20want%20to%20visit`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            <WhatsAppIcon />
            Book This Trip
          </a>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-muted hover:text-ink text-sm transition-colors">
            More stories from Bones
          </Link>
        </div>
      </main>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
