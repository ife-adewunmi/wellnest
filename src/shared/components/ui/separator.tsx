'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={[
      'bg-border shrink-0',
      orientation === 'horizontal' ? 'h-[2px] w-full bg-[#66666640]' : 'h-full w-[1px]',
      className, // this allows passing additional custom classes
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
