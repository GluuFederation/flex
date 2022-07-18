import React from "react"

const Wave = ({ fill = "#323c47ff", className }) => {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 175">
        <path
          d="M160 175H20c-11.05 0-20-8.95-20-20V11S17 0 37 0c27 0 50 13 108 14 8.84.15 35-3 35-3v144c0 11.05-8.95 20-20 20Z"
          style={{
            fill,
            fillRule: "evenodd",
          }}
        />
      </svg>
    </div>
  )
}

export default Wave
