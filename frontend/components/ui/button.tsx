import React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "rounded-xl sm:rounded-2xl font-medium transition-all duration-300 ease-out flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50 active:scale-[0.98]",

          variant === "default" &&
            "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-700/20 hover:shadow-xl hover:shadow-purple-700/30",

          variant === "outline" && "bg-transparent border border-white/20 text-white hover:bg-white/10",

          variant === "ghost" && "bg-transparent text-white hover:bg-white/10",

          size === "default" && "px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm",
          size === "sm" && "px-3 sm:px-4 py-1 sm:py-1.5 text-xs",
          size === "lg" && "px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base",

          className,
        )}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"
