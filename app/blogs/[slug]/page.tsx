import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CaretRight } from "@phosphor-icons/react/dist/ssr";

import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ArticleBody from "@/app/components/blog/ArticleBody";
import NewsletterSection from "@/app/components/blog/NewsletterSection";
import { posts, getPost } from "@/lib/blog";
import { parseMarkdown, splitTitle } from "@/lib/markdown";

const BASE_URL = "https://nextbiginnovationlabs.com";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

async function readBody(slug: string) {
  const file = path.join(process.cwd(), "content", "blog", `${slug}.md`);
  return fs.readFile(file, "utf8");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${BASE_URL}/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${BASE_URL}/blogs/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.isoDate,
      images: [{ url: post.image, width: 1200, height: 628, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const source = await readBody(slug);
  const { body } = splitTitle(source);
  const blocks = parseMarkdown(body);

  const index = posts.findIndex((p) => p.slug === slug);
  const next = posts[index + 1] ?? posts[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.isoDate,
    url: `${BASE_URL}/blogs/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Next Big Innovation Labs",
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <NavBar />
      <main id="main-content" className="bg-[var(--color-canvas)]">
        <article className="mx-auto max-w-3xl px-6 pt-32 pb-16 lg:pt-40 lg:pb-24">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--color-ink-muted)]">
              <li>
                <Link href="/" className="transition-colors hover:text-[var(--color-brand-strong)]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <CaretRight size={11} weight="bold" className="text-[var(--color-ink-faint)]" />
              </li>
              <li>
                <Link href="/blogs" className="transition-colors hover:text-[var(--color-brand-strong)]">
                  Blog
                </Link>
              </li>
            </ol>
          </nav>

          <header className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--color-brand-strong)]"
                >
                  {t}
                </span>
              ))}
              <span className="text-[13px] text-[var(--color-ink-muted)]">
                {post.date}
              </span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">
                ·
              </span>
              <span className="text-[13px] text-[var(--color-ink-muted)]">
                {post.readTime}
              </span>
            </div>

            <h1 className="h1">
              {post.title}
            </h1>

            <p className="text-[17px] leading-[1.7] text-[var(--color-ink-muted)]">
              {post.excerpt}
            </p>
          </header>

          {/* Cover art is served from the publisher's CDN, which is not in the
              next/image remote allowlist, so it stays a plain img. */}
          <div className="my-10 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt=""
              className="aspect-[1200/628] w-full object-cover"
            />
          </div>

          <ArticleBody blocks={blocks} />

          {post.sourceUrl && (
            <p className="mt-12 border-t border-[var(--color-hairline)] pt-6 text-[13px] leading-relaxed text-[var(--color-ink-faint)]">
              This article first appeared on the Next Big Innovation Labs blog.
            </p>
          )}

          <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-brand-strong)]"
            >
              <ArrowLeft size={15} weight="bold" aria-hidden="true" />
              All articles
            </Link>

            {next && next.slug !== post.slug && (
              <Link
                href={`/blogs/${next.slug}`}
                className="group flex flex-col gap-1 text-left sm:items-end sm:text-right"
              >
                <span className="text-[12.5px] text-[var(--color-ink-faint)]">
                  Read next
                </span>
                <span className="inline-flex items-center gap-2 font-display text-[15px] font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-brand-strong)]">
                  {next.title}
                  <ArrowRight
                    size={15}
                    weight="bold"
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            )}
          </div>
        </article>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
