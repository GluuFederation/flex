import React, { memo } from 'react'

interface ChevronIconProps {
  width?: number | string
  height?: number | string
  className?: string
}

export const ChevronIcon = memo<ChevronIconProps>(({ width = 18, height = 18, className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
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
))

ChevronIcon.displayName = 'ChevronIcon'
