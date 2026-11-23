import { AIM_SOURCE_COLORS } from '@/lib/aim-colors'
import { AimWordmark } from '@/lib/aim-wordmark'

/** Wordmark: A appetites, I intrinsic motivation, M mimetic desire. */
export function AimMark({ className }: { className?: string }) {
  const { frame } = AimWordmark
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={AimWordmark.viewBox}
      className={className}
      role="img"
      aria-label="AIM"
    >
      <rect
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        fill="#ffffff"
      />
      <path
        fill={AIM_SOURCE_COLORS.appetites}
        d={AimWordmark.letters.appetites}
      />
      <path
        fill={AIM_SOURCE_COLORS.intrinsic}
        d={AimWordmark.letters.intrinsic}
      />
      <path fill={AIM_SOURCE_COLORS.mimetic} d={AimWordmark.letters.mimetic} />
    </svg>
  )
}
