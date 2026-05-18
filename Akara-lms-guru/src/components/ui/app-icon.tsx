import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const appIconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

const iconBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center border transition-colors",
  {
    variants: {
      size: {
        sm: "h-8 w-8 rounded-xl",
        md: "h-10 w-10 rounded-[14px]",
        lg: "h-11 w-11 rounded-[18px]",
      },
      tone: {
        ghost: "border-transparent bg-transparent text-current",
        subtle: "border-transparent bg-[var(--surface-subtle)] text-[var(--muted-ink)]",
        accent:
          "border-[rgba(90,97,214,0.14)] bg-[rgba(90,97,214,0.08)] text-[var(--accent)]",
        brand:
          "border-transparent bg-[linear-gradient(135deg,#3943b7,#5a61d6)] text-white shadow-[0_14px_24px_rgba(57,67,183,0.18)]",
        danger: "border-transparent bg-[var(--danger-soft)] text-[#be123c]",
        success: "border-transparent bg-[var(--success-soft)] text-[var(--success)]",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "subtle",
    },
  }
);

const iconPixelMap = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
} as const;

type AppIconSize = keyof typeof iconPixelMap;
type IconBadgeSize = NonNullable<VariantProps<typeof iconBadgeVariants>["size"]>;
type IconBadgeTone = NonNullable<VariantProps<typeof iconBadgeVariants>["tone"]>;

type AppIconProps = {
  icon: LucideIcon;
  size?: AppIconSize;
  className?: string;
  strokeWidth?: number;
};

type IconBadgeProps = {
  icon: LucideIcon;
  size?: IconBadgeSize;
  tone?: IconBadgeTone;
  className?: string;
  iconClassName?: string;
  strokeWidth?: number;
};

export function AppIcon({
  icon: Icon,
  size = "sm",
  className,
  strokeWidth = 1.9,
}: AppIconProps) {
  return (
    <Icon
      aria-hidden="true"
      size={iconPixelMap[size]}
      strokeWidth={strokeWidth}
      className={cn(appIconVariants({ size }), className)}
    />
  );
}

export function IconBadge({
  icon,
  size = "md",
  tone = "subtle",
  className,
  iconClassName,
  strokeWidth = 1.9,
}: IconBadgeProps) {
  return (
    <span className={cn(iconBadgeVariants({ size, tone }), className)}>
      <AppIcon
        icon={icon}
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
        className={iconClassName}
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
