import * as React from "react"
import { Field } from "@base-ui/react/field"
import { cn } from "@/shared/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Field.Label>
>(({ className, ...props }, ref) => (
  <Field.Label
    ref={ref}
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }

