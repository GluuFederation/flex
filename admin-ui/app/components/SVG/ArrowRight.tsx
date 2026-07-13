import { memo } from 'react'

type ArrowRightIconProps = {
  width?: number | string
  height?: number | string
  className?: string
}

export const ArrowRightIcon = memo<ArrowRightIconProps>(
  ({ width = 10, height = 10, className }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      className={className}
      style={{ display: 'block' }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 5h8M5.5 1.5L9 5l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
)

ArrowRightIcon.displayName = 'ArrowRightIcon'
