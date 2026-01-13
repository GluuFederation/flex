import React from 'react'

interface ServicesProps {
  fill?: string
  className: string
}

const ServicesIcon: React.FC<ServicesProps> = ({ fill = 'currentColor', className }) => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke={fill}
        strokeWidth="1.5"
        width="28"
        height="28"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-2.496m2.496-2.496L15.17 8.58m-3.75 3.75l-3.75 3.75m0 0L3 21m8.42-8.42l3.75-3.75M3 21l3.75-3.75m0 0L8.58 15.17M6.75 6.75L3 3m3.75 3.75L11.42 8.58"
        />
      </svg>
    </div>
  )
}

export default ServicesIcon
