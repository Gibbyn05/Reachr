import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-[#09fe94] hover:bg-[#00e882] text-[#171717] font-bold shadow-[0_2px_12px_rgba(9,254,148,0.3)]",
  secondary: "bg-[#faf8f2] hover:bg-[#e8e4d8] text-[#171717] border border-[#d8d3c5] font-semibold",
  ghost: "bg-transparent hover:bg-[#e8e4d8] text-[#3d3a34] font-medium",
  danger: "bg-[#ff470a] hover:bg-[#e03c08] text-white font-semibold shadow-sm",
  outline: "bg-transparent hover:bg-[#09fe94]/10 text-[#171717] border border-[#d8d3c5] font-semibold",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-2.5 text-sm rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
