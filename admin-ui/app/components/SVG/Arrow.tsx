import { memo } from 'react'

interface ArrowIconProps {
  className?: string
}

const ArrowIcon = memo<ArrowIconProps>(({ className }) => (
  <svg
    width="15"
    height="10"
    viewBox="0 0 15 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M7.5 0L0 10H15L7.5 0Z" fill="currentColor" />
  </svg>
))
ArrowIcon.displayName = 'ArrowIcon'

export default ArrowIcon
