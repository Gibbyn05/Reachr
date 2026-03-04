import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-green-500 hover:bg-green-600 text-white font-semibold shadow-sm",
  secondary: "bg-white hover:bg-gray-50 text-slate-900 border border-gray-200 font-semibold shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 text-slate-700 font-medium",
  danger: "bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm",
  outline: "bg-transparent hover:bg-green-50 text-green-600 border border-green-500 font-semibold",
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
