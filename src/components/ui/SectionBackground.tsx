import Image from "next/image";
import { ReactNode } from "react";

interface SectionBackgroundProps {
    children: ReactNode;
    className?: string;
}

export default function SectionBackground({ children, className = "" }: SectionBackgroundProps) {
    return (
        <section className={`relative w-full overflow-hidden ${className}`}>
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/design_bg.jpg"
                    alt="Background Pattern"
                    fill
                    className="object-cover opacity-[0.02]"
                    quality={100}
                    priority
                />

                {/* Brown Overlay with 25% Opacity */}
                <div className="absolute inset-0 bg-brown-dark opacity-25" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                {children}
            </div>
        </section>
    );
}
