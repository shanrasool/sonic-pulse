"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"

const CustomAccordion = AccordionPrimitive.Root

const CustomAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-white/10", className)}
    {...props}
  />
))
CustomAccordionItem.displayName = "CustomAccordionItem"

const CustomAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-white/90 [&[data-state=open]>svg]:rotate-180",
        "group rounded-md px-3 hover:bg-white/5 transition-all duration-200",
        "data-[state=open]:bg-gradient-to-r data-[state=open]:from-purple-900/20 data-[state=open]:to-blue-900/20",
        "data-[state=open]:shadow-[0_0_10px_rgba(168,85,247,0.2)]",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-white/50 transition-transform duration-200 group-hover:text-white/80" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
CustomAccordionTrigger.displayName = "CustomAccordionTrigger"

const CustomAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      "bg-gradient-to-r from-purple-900/10 to-blue-900/10 rounded-b-md px-4 pb-4 pt-2",
      "border-l-2 border-purple-500/30",
      className
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
CustomAccordionContent.displayName = "CustomAccordionContent"

export { CustomAccordion, CustomAccordionItem, CustomAccordionTrigger, CustomAccordionContent }
