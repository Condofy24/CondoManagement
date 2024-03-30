"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const BalanceProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, children, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-500",
      className,
    )}
    {...props}
  >
    <div className="absolute w-full flex items-center justify-center py-1 text-xl font-bold text-black dark:text-black z-10">
      {children}
    </div>
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-green-300 dark:bg-green-500 transition-all "
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
BalanceProgress.displayName = ProgressPrimitive.Root.displayName;

export { BalanceProgress };
