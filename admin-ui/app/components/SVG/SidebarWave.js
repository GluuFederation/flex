import React from "react"

const Wave = ({ fill = "#323c47ff", className }) => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="transition duration-300 ease-in-out delay-150"
        viewBox="0 0 1440 700"
      >
        <path
          fill={fill}
          strokeWidth="0"
          d="M0 700V350c91.455-61.847 182.91-123.694 289-90s226.818 162.928 309 181c82.182 18.072 125.818-75.02 224-97 98.182-21.98 250.91 27.148 363 40s183.545-10.574 255-34v350z"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
      </svg>
    </div>
  )
}

export default Wave
