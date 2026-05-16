'use client'

import React, { useState, useEffect, useId } from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface DateInputProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  error?: string
  id?: string
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }

  return !isNaN(date.getTime())
}

export const DateInput = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  className,
  error,
  id: externalId
}: DateInputProps) => {
  const fallbackId = useId()
  const id = externalId ?? fallbackId
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(formatDate(value))
  const [month, setMonth] = useState<Date | undefined>(value || new Date())

  // Sync internal state when external value changes
  useEffect(() => {
    setInputValue(formatDate(value))
    if (value) {
      setMonth(value)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    
    const parsedDate = new Date(val)
    if (isValidDate(parsedDate)) {
      onChange?.(parsedDate)
      setMonth(parsedDate)
    } else if (val === '') {
      onChange?.(undefined)
    }
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate)
    setInputValue(formatDate(selectedDate))
    setOpen(false)
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-bold">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className={cn(
            "bg-muted/30 border-border/40 focus:bg-background transition-all pe-10",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          onChange={handleInputChange}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              type="button"
              variant='ghost' 
              size="icon"
              className="absolute top-1/2 end-1 size-8 -translate-y-1/2 hover:bg-transparent text-muted-foreground"
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">Pick a date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align='end' sideOffset={10}>
            <Calendar
              mode='single'
              selected={value}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
    </div>
  )
}
