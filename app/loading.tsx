import AnimatedLoadingSkeleton from "@/components/ui/animated-loading-skeleton";

/** Root-level loading UI — the App Router swaps this in automatically
    during navigation to any route that doesn't have its own nested
    loading.tsx, while the real page's data/render is still in flight. */
export default function Loading() {
  return <AnimatedLoadingSkeleton />;
}
