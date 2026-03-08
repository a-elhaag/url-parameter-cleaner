import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.25rem] text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default: 'neo-primary text-primary-foreground',
        destructive: 'neo-btn !bg-destructive text-white hover:opacity-90',
        outline: 'neo-btn text-foreground',
        secondary: 'neo-btn text-secondary-foreground',
        ghost: 'hover:bg-accent/50 text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-14 px-8 py-2',
        sm: 'h-10 px-6',
        lg: 'h-16 px-10 text-base',
        icon: 'size-14 rounded-full',
        'icon-sm': 'size-10 rounded-full',
        'icon-lg': 'size-16 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
