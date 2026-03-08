import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'neo-inset file:text-foreground placeholder:text-muted-foreground/60 h-14 w-full min-w-0 rounded-[1.25rem] bg-transparent px-5 py-3 text-base outline-none transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
