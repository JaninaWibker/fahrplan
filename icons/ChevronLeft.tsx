import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function ChevronLeft(props, ref) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" ref={ref} {...props}>
      <polyline stroke="currentColor" strokeWidth="2" points="15 18 9 12 15 6"></polyline>
    </svg>
  )
})
