import React from "react"

const Logo = ({ width = 50, height = 50 }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect 
      x="10" 
      y="20" 
      width="80" 
      height="60" 
      rx="8" 
      ry="8" 
      fill="var(--logo-rect-fill)" 
      opacity="var(--logo-rect-opacity)"
    />
    <text 
      x="30" 
      y="55" 
      fontFamily="monospace" 
      fontSize="24" 
      fill="#ffffff"
    >
      &lt;/&gt;
    </text>
  </svg>
)

export default Logo
