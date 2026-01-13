import React from 'react'

interface ScimProps {
  fill?: string
  className: string
  style?: React.CSSProperties
}

const ScimIcon: React.FC<ScimProps> = ({ fill = 'currentColor', className, style }) => {
  return (
    <div className={className} style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke={fill}
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.11c-2.006 1.965-3.127 4.703-3.127 7.536 0 6.628 5.373 12 12 12s12-5.372 12-12c0-2.833-1.121-5.57-3.127-7.536A11.959 11.959 0 0012 2.714z"
        />
      </svg>
    </div>
  )
}
export default ScimIcon
