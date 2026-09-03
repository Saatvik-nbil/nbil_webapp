/**
 * Route-level loading fallback (see app/loading.tsx). Shown by the App
 * Router during navigation, in place of the real page, whenever the target
 * route doesn't resolve instantly. Server-renderable, with no animation logic
 * of its own, it just leans on the `.skeleton` shimmer utility already
 * defined in app/globals.css (which the global prefers-reduced-motion rule
 * there already neutralises, so nothing extra is needed here for that).
 *
 * Shaped like a generic page (a nav strip, a hero block, a row of cards)
 * rather than any one specific route, since it's the fallback for all of
 * them.
 */
export default function AnimatedLoadingSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-[100svh] bg-[var(--color-canvas)]">
      {/* Nav strip */}
      <div className="flex h-20 items-center border-b border-[var(--color-hairline)] px-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="skeleton h-7 w-28 rounded-lg" />
          <div className="hidden gap-6 sm:flex">
            <div className="skeleton h-4 w-16 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
          </div>
          <div className="skeleton h-9 w-24 rounded-full" />
        </div>
      </div>

      {/* Hero block */}
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 pb-16 pt-20 lg:pt-28">
        <div className="skeleton h-3.5 w-32 rounded" />
        <div className="skeleton h-11 w-[min(90%,34rem)] rounded-lg" />
        <div className="skeleton h-11 w-[min(70%,24rem)] rounded-lg" />
        <div className="mt-2 flex flex-col gap-2.5">
          <div className="skeleton h-4 w-full max-w-2xl rounded" />
          <div className="skeleton h-4 w-full max-w-xl rounded" />
        </div>
        <div className="mt-3 flex gap-3">
          <div className="skeleton h-11 w-40 rounded-xl" />
          <div className="skeleton h-11 w-32 rounded-xl" />
        </div>
      </div>

      {/* Card row */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-[var(--color-hairline)] p-5"
          >
            <div className="skeleton aspect-[4/3] w-full rounded-xl" />
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3.5 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
