"use client";

import type { LucideIcon } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActionMenuItem = {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type ActionMenuProps = {
  ariaLabel: string;
  items: ActionMenuItem[];
};

export function ActionMenu({ ariaLabel, items }: ActionMenuProps) {
  const primaryItems = items.filter((item) => !item.destructive);
  const destructiveItems = items.filter((item) => item.destructive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={ariaLabel}>
          <AppIcon icon={MoreHorizontal} size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {primaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              {Icon ? <AppIcon icon={Icon} size="sm" /> : null}
              {item.label}
            </DropdownMenuItem>
          );
        })}

        {primaryItems.length > 0 && destructiveItems.length > 0 ? <DropdownMenuSeparator /> : null}

        {destructiveItems.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className="text-[var(--danger)] focus:bg-[var(--danger-soft)] focus:text-[var(--danger)]"
            >
              {Icon ? <AppIcon icon={Icon} size="sm" /> : null}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
