'use client'

import React, { useId, useRef } from 'react'

import { CircleXIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface StudioInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  onClear?: () => void
  containerClassName?: string
}

export const StudioInput = React.forwardRef<HTMLInputElement, StudioInputProps>(
  (
    { label, value, onChange, onClear, containerClassName, id: externalId, className, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)
    const fallbackId = useId()
    const id = externalId ?? fallbackId

    const handleClearInput = () => {
      if (onClear) {
        onClear()
      } else if (onChange) {
        // Mock a change event to clear the value
        const event = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }

      // Handle focus depending on ref type
      if (typeof ref === 'function') {
        // Cannot reliably focus if ref is a function
      } else if (ref && ref.current) {
        ref.current.focus()
      } else if (internalRef.current) {
        internalRef.current.focus()
      }
    }

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && <Label htmlFor={id} className="text-sm font-bold">{label}</Label>}
        <div className="relative">
          <Input
            ref={ref || internalRef}
            id={id}
            value={value}
            onChange={onChange}
            className={cn("pe-9", className)}
            {...props}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearInput}
              className="absolute right-0 top-0 h-full w-9 text-muted-foreground hover:bg-transparent"
            >
              <CircleXIcon className="size-4" />
              <span className="sr-only">Clear input</span>
            </Button>
          )}
        </div>
      </div>
    )
  }
)

StudioInput.displayName = 'StudioInput'
