"use client"

import { useId, useState } from "react"
import { CircleCheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command as CommandPrimitive } from "cmdk"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SearchSelectProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  label?: string
  emptyMessage?: string
  className?: string
  containerClassName?: string
}

const SearchSelect = ({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  label,
  emptyMessage = "No results found.",
  className,
  containerClassName,
}: SearchSelectProps) => {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState("")

  const activeValue = value !== undefined ? value : internalValue
  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === activeValue ? "" : currentValue
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
    setOpen(false)
  }

  const selectedOption = options.find((option) => option.value === activeValue)

  return (
    <div className={cn("w-full max-w-xs space-y-2", containerClassName)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("h-8 w-full justify-between px-2.5 font-normal", className)}
          >
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandPrimitive.Item
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className={cn(
                      "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground",
                      "flex justify-between"
                    )}
                  >
                    <p className="flex-1">{option.label}</p>
                    <CircleCheckIcon
                      className={cn(
                        "ml-2 size-4 shrink-0 fill-blue-500 stroke-white",
                        activeValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandPrimitive.Item>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default SearchSelect
