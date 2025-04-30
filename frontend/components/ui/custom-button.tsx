import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] hover:from-purple-500 hover:to-blue-500",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] hover:from-red-500 hover:to-pink-500",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/30 hover:text-white backdrop-blur-sm",
        secondary:
          "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20",
        ghost: "text-white hover:bg-white/10 hover:text-white",
        link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
        glow: "relative bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden isolate before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-400/20 before:to-blue-400/20 before:blur-xl before:animate-pulse before:-z-10 hover:before:animate-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton, buttonVariants }
