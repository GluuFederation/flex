import React, { useId } from 'react'
interface JansKcLinkIconProps {
  fill?: string
  className: string
  style?: React.CSSProperties
  decorative?: boolean
  title?: string
}

const JansKcLinkIcon: React.FC<JansKcLinkIconProps> = ({
  fill = 'currentColor',
  className,
  style,
  decorative = false,
  title,
}) => {
  const titleId = useId()
  const iconTitle = title || 'Jans Keycloak Link icon'

  return (
    <div className={className} style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke={fill}
        strokeWidth="1.5"
        width="28"
        height="28"
        role="img"
        aria-hidden={decorative}
        aria-labelledby={decorative ? undefined : titleId}
      >
        {!decorative && <title id={titleId}>{iconTitle}</title>}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
    </div>
  )
}
export default JansKcLinkIcon
