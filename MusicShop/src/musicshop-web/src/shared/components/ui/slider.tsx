import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/shared/lib/utils"

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'onValueCommitted'> {
  onValueCommitted?: (values: number[]) => void
}


const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, defaultValue, onValueCommitted, ...props }, ref) => {
    return (
      <SliderPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        onValueCommitted={(value) => {
          // Ensure we always pass an array if that's what's expected, 
          // or just pass the value if the consumer expects number[]
          onValueCommitted?.(Array.isArray(value) ? value : [value])
        }}

        className={cn(
          "group relative flex w-full touch-none select-none items-center py-4",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Control className="relative flex w-full items-center">
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <SliderPrimitive.Indicator className="absolute h-full bg-primary transition-all duration-300 ease-out group-active:duration-75" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb 
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-95 shadow-md cursor-grab active:cursor-grabbing" 
          />
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
