import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, getBlogPost } from "@/lib/blog";
import { trackEvent } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug) {
    const post = getBlogPost(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    trackEvent({ eventType: "blog_view", page: `/blog/${slug}` }).catch(() => {});
    return NextResponse.json({ post });
  }

  const posts = getPublishedPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    readingMinutes: p.readingMinutes,
    tags: p.tags,
  }));

  return NextResponse.json({ posts });
}
