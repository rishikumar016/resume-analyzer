import React from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  loadingText?: string
}

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ isLoading = false, loadingText, children, disabled, ...props }, ref) => {
  return (
    <Button ref={ref} disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  )
})

LoadingButton.displayName = 'LoadingButton'
