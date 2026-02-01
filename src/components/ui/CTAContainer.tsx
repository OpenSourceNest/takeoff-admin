"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CTAContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function CTAContainer({ children, className = "" }: CTAContainerProps) {
    return (
        <div className={`relative bg-black-soft overflow-hidden flex items-center justify-center px-6 py-12 md:py-0 ${className}`}>

            {/* Rocket Asset - Left Bottom */}
            <motion.div
                className="absolute 
                left-[-10px] bottom-[-20px] w-[100px] h-[90px] opacity-30
                md:left-[-15px] md:bottom-[-40px] md:w-[150px] md:h-[155px] md:opacity-40
                lg:left-[-20px] lg:bottom-[-60px] lg:w-[240px] lg:h-[248px] lg:opacity-50 
                rotate-[9.84deg] pointer-events-none z-0"
                animate={{
                    x: [0, 20, 0],
                    y: [0, -10, 0],
                    rotate: [9.84, 12, 9.84]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Image
                    src="/rocket.png"
                    alt="Rocket launching"
                    fill
                    sizes="(max-width: 768px) 100px, (max-width: 1024px) 150px, 240px"
                    className="object-contain"
                />
            </motion.div>

            {/* Cloud Asset - Right Top */}
            <div className="absolute 
                right-[-100px] top-[-100px] w-[200px] h-[216px] opacity-30
                md:right-[-150px] md:top-[-150px] md:w-[320px] md:h-[344px] md:opacity-40
                lg:right-[-189px] lg:top-[-174px] lg:w-[450px] lg:h-[484px] lg:opacity-50 
                pointer-events-none z-0">
                <Image
                    src="/cloud.png"
                    alt="Cloud"
                    fill
                    sizes="(max-width: 768px) 200px, (max-width: 1024px) 320px, 450px"
                    className="object-contain"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
