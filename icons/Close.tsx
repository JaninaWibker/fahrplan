import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Close(props, ref) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" ref={ref} {...props}>
      <line stroke="currentColor" strokeWidth="2" x1="18" y1="6" x2="6" y2="18"></line>
      <line stroke="currentColor" strokeWidth="2" x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
})
