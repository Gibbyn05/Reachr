import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
          <input
            ref={ref}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#d8d3c5] bg-[#faf8f2] text-[#171717] placeholder:text-[#a09b8f] focus:outline-none focus:ring-2 focus:ring-[#09fe94]/20 focus:border-[#09fe94]/60 transition-all duration-200 text-sm",
              className
            )}
            {...props}
          />
        </div>
      );
    }
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-lg border border-[#d8d3c5] bg-[#faf8f2] text-[#171717] placeholder:text-[#a09b8f] focus:outline-none focus:ring-2 focus:ring-[#09fe94]/20 focus:border-[#09fe94]/60 transition-all duration-200 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
