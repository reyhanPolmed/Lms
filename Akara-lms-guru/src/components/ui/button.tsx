import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-sm font-medium tracking-[-0.006em] transition-[background,color,border-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(79,70,199,0.28)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[var(--accent)] text-white shadow-[0_12px_24px_rgba(79,70,199,0.18)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]",
        secondary:
          "border border-[var(--line)] bg-[var(--surface)] text-[var(--page-ink)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-[rgba(79,70,199,0.22)] hover:bg-[var(--surface-subtle)]",
        outline:
          "border border-[rgba(90,97,214,0.16)] bg-[var(--accent-soft)] text-[var(--accent)] hover:border-[rgba(90,97,214,0.28)] hover:bg-[rgba(90,97,214,0.12)]",
        ghost:
          "border border-transparent bg-transparent text-[var(--muted-ink)] hover:bg-[var(--surface-subtle)] hover:text-[var(--page-ink)]",
        destructive:
          "border border-transparent bg-[#dc2626] text-white shadow-[0_16px_32px_rgba(220,38,38,0.22)] hover:bg-[#b91c1c]",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-[13px]",
        lg: "h-12 px-5 text-[15px]",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
