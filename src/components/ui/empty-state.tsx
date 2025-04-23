
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  isLoading?: boolean;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  isLoading = false,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {isLoading ? (
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      ) : Icon ? (
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      ) : null}
      
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild disabled={isLoading}>
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction} disabled={isLoading}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
