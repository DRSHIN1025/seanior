import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neutral-900 text-white",
        secondary: "border-transparent bg-neutral-100 text-neutral-900",
        destructive: "border-transparent bg-red-100 text-red-800 border-red-200",
        outline: "text-neutral-950 border-neutral-300",
        success: "bg-emerald-100 text-emerald-800 border-emerald-300",
        warning: "bg-amber-100 text-amber-800 border-amber-300",
        info: "bg-blue-100 text-blue-800 border-blue-300",
        purple: "bg-purple-100 text-purple-800 border-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
