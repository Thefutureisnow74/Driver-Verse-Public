import { cn } from "@/lib/utils";

interface LogoProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md", ...props }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className={cn("rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold", sizeClasses[size])}>
        <span className={cn("leading-none", size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base")}>
          DG
        </span>
      </div>
      <span className={cn("font-bold text-foreground", textSizeClasses[size])}>
        DriverGigsPro
      </span>
    </div>
  );
}
