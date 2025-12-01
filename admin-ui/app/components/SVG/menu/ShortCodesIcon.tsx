import React from 'react'

interface ShortCodesIconProps {
  className?: string
  style?: React.CSSProperties
}

const ShortCodesIcon: React.FC<ShortCodesIconProps> = ({ className, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      style={{ width: '18px' }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
      />
    </svg>
  )
}

export default ShortCodesIcon
