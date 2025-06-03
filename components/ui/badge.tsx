import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        primary:
          "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40 border border-blue-100 dark:border-blue-800/40",
        secondary:
          "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/60 border border-gray-200 dark:border-gray-700/40",
        success:
          "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/40 border border-emerald-100 dark:border-emerald-800/40",
        warning:
          "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-800/40 border border-amber-100 dark:border-amber-800/40",
        destructive:
          "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/40 border border-red-100 dark:border-red-800/40",
        outline: 
          "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-800/50",
        modern:
          "bg-white/90 text-gray-700 hover:bg-white dark:bg-gray-800/60 dark:text-gray-200 dark:hover:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700/40 shadow-sm",
        accent:
          "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 dark:text-blue-300 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-200/50 dark:border-blue-700/30",
      },
      size: {
        sm: "px-1.5 py-0.5 text-2xs",
        default: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
