import { ReactNode, ElementType, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "outline" | "ghost" | "accent";
    rounded?: "full" | "20px";
    icon?: ElementType;
    iconPosition?: "left" | "right";
    isActive?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    rounded = "full",
    className = "",
    icon: Icon,
    iconPosition = "right",
    isActive = false,
    ...props
}: ButtonProps) {
    const roundingClass = rounded === "20px" ? "rounded-[20px]" : "rounded-full";
    const baseStyles = `inline-flex items-center justify-center gap-2 px-8 py-3 ${roundingClass} font-semibold transition-all duration-200 cursor-pointer text-sm`;

    const variants = {
        primary: isActive ? "bg-black-soft text-white" : "bg-cream text-black hover:bg-cream-light",
        outline: "bg-transparent border border-orange text-white hover:bg-cream-light hover:text-black hover:border-cream-light",
        ghost: "bg-transparent text-orange hover:text-orange",
        accent: "bg-orange text-white hover:bg-orange/90 border border-orange",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && iconPosition === "left" && <Icon fontSize="small" />}
            {children}
            {Icon && iconPosition === "right" && <Icon fontSize="small" />}
        </button>
    );
}
