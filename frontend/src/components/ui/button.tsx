import React from "react"
import clsx from "clsx"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        "bg-gray-100 hover:bg-gray-200 text-gray-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = "Button"
