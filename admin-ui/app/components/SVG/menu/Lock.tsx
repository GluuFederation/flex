import React, { useId } from 'react'

interface LockProps {
  stroke?: string
  className?: string
  style?: React.CSSProperties
  width?: number | string
  height?: number | string
  size?: number | string
}

const LockIcon: React.FC<LockProps> = ({
  stroke = 'currentColor',
  className = '',
  style,
  width,
  height,
  size,
}) => {
  const titleId = useId()
  const svgWidth = size ?? width ?? 28
  const svgHeight = size ?? height ?? 28

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={stroke}
      strokeWidth="1.5"
      width={svgWidth}
      height={svgHeight}
      role="img"
      aria-labelledby={titleId}
      className={className}
      style={style}
    >
      <title id={titleId}>Lock icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}

export default LockIcon
