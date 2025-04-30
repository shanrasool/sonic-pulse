import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-[0_0_10px_rgba(168,85,247,0.3)]",
        secondary:
          "bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/15",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white border-transparent shadow-[0_0_10px_rgba(239,68,68,0.3)]",
        outline: "text-white border-white/30 bg-transparent hover:bg-white/5",
        success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]",
        token: "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-purple-500/30 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function CustomBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { CustomBadge, badgeVariants }
