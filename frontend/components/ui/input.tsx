import React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "w-full rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40",
        "backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/50",
        "transition-all duration-300 ease-in-out shadow-inner shadow-black/10",
        "hover:border-white/30 focus:border-purple-400/50",
        "text-sm sm:text-base",
        className,
      )}
    />
  )
})

Input.displayName = "Input"
