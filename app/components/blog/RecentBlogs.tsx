"use client";

import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";
import { posts } from "@/lib/blog";

export default function RecentBlogs() {
  return (
    <section
      id="recent"
      aria-labelledby="recent-heading"
      className="scroll-mt-24 bg-[var(--color-canvas)] py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-10 lg:mb-14">
          <h2
            id="recent-heading"
            className="h2"
          >
            From Next Big Blogs
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <GlassBlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              href={`/blogs/${post.slug}`}
              date={post.date}
              readTime={post.readTime}
              tags={post.tags}
              ctaLabel="Read article"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
