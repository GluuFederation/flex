import React from 'react'

interface LockProps {
  fill?: string
  className: string
  style?: React.CSSProperties
}

const LockIcon: React.FC<LockProps> = ({ fill = 'currentColor', className, style }) => {
  return (
    <div className={className} style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke={fill}
        strokeWidth="1"
        width="28"
        height="28"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </div>
  )
}

export default LockIcon
