"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> {
  defaultValue?: number[]
  onValueCommit?: (values: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, defaultValue, onValueCommit, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue?.[0] || 0)

    return (
      <div className="relative flex w-full touch-none select-none items-center">
        <input
          type="range"
          ref={ref}
          min={props.min || 0}
          max={props.max || 100}
          step={props.step || 1}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            setValue(val)
          }}
          onMouseUp={() => onValueCommit?.([value, 500])} // Simplified for demo
          className={cn(
            "h-2 w-full appearance-none rounded-lg bg-neutral-800 accent-blue-600 outline-none",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
