import React, { useId } from 'react'

interface UserClaimsProps {
  fill?: string
  className: string
}

const UserClaimsIcon: React.FC<UserClaimsProps> = ({ fill = 'currentColor', className }) => {
  const titleId = useId()
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 32 32"
        stroke={fill}
        strokeWidth="1.66667"
        width="28"
        height="28"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>User Claims icon</title>
        <circle cx="14.8333" cy="17.1667" r="4.5" />
        <circle cx="20.3333" cy="10.6667" r="1.66667" />
        <circle cx="24.1667" cy="22.8333" r="2.5" />
        <circle cx="8.16667" cy="25.5" r="1.5" />
        <circle cx="10" cy="7" r="1.33333" />
        <path d="M19.2176 19.0499L22.3322 21.3353M10.6367 8.40451L12.9989 13.0018M8.58333 24.9016L11.9498 20.6687M17.5833 13.9017L19.6655 11.5021" />
      </svg>
    </div>
  )
}

export default UserClaimsIcon
