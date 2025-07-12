"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={[
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[2px] bg-[#66666640] w-full" : "h-full w-[1px]",
        className, // this allows passing additional custom classes
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
)

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
