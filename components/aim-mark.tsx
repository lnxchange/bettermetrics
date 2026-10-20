import { AIM_SOURCE_COLORS } from '@/lib/aim-colors'

/** Wordmark: A appetites, I intrinsic motivation, M mimetic desire. */
export function AimMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-18 249 1738 738"
      className={className}
      role="img"
      aria-label="AIM"
    >
      <rect x="-18" y="249" width="1738" height="738" fill="#ffffff" />
      <path
        fill={AIM_SOURCE_COLORS.appetites}
        d="M249 699 342 437H344L434 699ZM264 261 -6 975H152L208 816H475L529 975H692L425 261Z"
      />
      <path fill={AIM_SOURCE_COLORS.intrinsic} d="M699 261V975H856V261Z" />
      <path
        fill={AIM_SOURCE_COLORS.mimetic}
        d="M939 261V975H1086V474H1088L1263 975H1384L1559 469H1561V975H1708V261H1487L1329 752H1327L1160 261Z"
      />
    </svg>
  )
}
