import React, { useId } from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface TextAreaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, containerClassName, id: externalId, className, ...props }, ref) => {
    const fallbackId = useId()
    const id = externalId ?? fallbackId

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && <Label htmlFor={id} className="text-sm font-bold">{label}</Label>}
        <Textarea 
          ref={ref}
          id={id} 
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          aria-invalid={!!error}
          {...props} 
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
