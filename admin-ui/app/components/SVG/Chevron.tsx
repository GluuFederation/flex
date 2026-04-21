import { memo } from 'react'

type ChevronDirection = 'up' | 'down' | 'left' | 'right'

type ChevronIconProps = {
  width?: number | string
  height?: number | string
  className?: string
  direction?: ChevronDirection
}

const ROTATION: Record<ChevronDirection, string> = {
  down: '0deg',
  up: '180deg',
  left: '90deg',
  right: '-90deg',
}

export const ChevronIcon = memo<ChevronIconProps>(
  ({ width = 18, height = 18, className, direction = 'down' }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      style={{ display: 'block', transform: `rotate(${ROTATION[direction]})` }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
)

ChevronIcon.displayName = 'ChevronIcon'
