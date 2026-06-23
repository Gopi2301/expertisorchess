import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  hover?: boolean;
  size?: "default" | "sm";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        data-size={size}
        className={cn(
          "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
          hover && "card-hover cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "group/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn(
        "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
)
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; up: boolean };
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, accent }) => (
  <Card className={`relative overflow-hidden ${accent ? 'border-bg-brand/30' : ''}`}>
    {accent && (
      <div className="absolute top-0 right-0 w-24 h-24 bg-bg-brand/5 rounded-full -mr-8 -mt-8" />
    )}
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${accent ? 'bg-bg-brand/10 text-bg-brand' : 'bg-bg-muted text-text-secondary'}`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend.up ? 'text-text-success' : 'text-error-strong'}`}>
          {trend.up ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary mt-0.5">{label}</p>
    </div>
  </Card>
)

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  StatCard,
}
