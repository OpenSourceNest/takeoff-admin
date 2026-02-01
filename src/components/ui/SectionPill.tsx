import { ElementType } from "react";

interface SectionPillProps {
    title: string;
    icon: ElementType;
    className?: string;
}

export default function SectionPill({ title, icon: Icon, className = "" }: SectionPillProps) {
    return (
        <div className={`inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brown-dark border border-brown-dark/30 shadow-sm ${className}`}>
            <Icon className="text-white" style={{ fontSize: 25 }} />
            <span className="text-white text-sm font-medium tracking-wide">
                {title}
            </span>
        </div>
    );
}
