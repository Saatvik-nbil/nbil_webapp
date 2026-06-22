'use client'

import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: () => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative flex flex-col items-center gap-3">
            {/* Spinning ring */}
            <div
              className="size-12 rounded-full"
              style={{
                border: '2px solid rgba(109,40,217,0.15)',
                borderTopColor: 'var(--color-brand)',
                animation: 'spin 0.9s linear infinite',
              }}
            />
            <span className="text-[12px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)] animate-pulse">
              Loading 3D…
            </span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </Suspense>
  )
}
