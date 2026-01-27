import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap font-heading font-bold transition-[transform,box-shadow,background-color,color,border-color] duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-brand-dark text-white border-2 border-brand-dark shadow-solid hover:bg-brand-accent hover:-translate-y-0.5 hover:shadow-solid-lg active:translate-y-0 active:shadow-none",
                destructive:
                    "bg-red-600 text-white border-2 border-brand-dark shadow-solid hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-solid-lg active:translate-y-0 active:shadow-none",
                outline:
                    "bg-transparent text-brand-dark border-2 border-brand-dark hover:bg-brand-dark hover:text-white",
                secondary:
                    "bg-white text-brand-dark border-2 border-brand-dark shadow-solid hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-solid-lg active:translate-y-0 active:shadow-none",
                ghost: "bg-transparent text-gray-600 hover:text-brand-primary hover:bg-gray-100",
                link: "text-brand-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-5 py-2 rounded-lg text-base",
                sm: "h-9 px-3 py-1 rounded-md text-sm",
                lg: "h-14 px-8 py-3 rounded-xl text-lg",
                icon: "size-10 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
