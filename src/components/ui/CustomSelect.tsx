"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    id?: string;
    options: Option[] | string[];
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    className?: string;
    multiple?: boolean;
}

export default function CustomSelect({
    id,
    options,
    value,
    onChange,
    placeholder = "Select",
    className = "",
    multiple = false
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        if (!onChange) return;

        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const isSelected = currentValues.includes(optionValue);

            let newValues;
            if (isSelected) {
                newValues = currentValues.filter(v => v !== optionValue);
            } else {
                newValues = [...currentValues, optionValue];
            }
            onChange(newValues);
            // Don't close on selection for multi-select
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const handleRemove = (e: React.MouseEvent, optionValue: string) => {
        e.stopPropagation(); // Prevent dropdown toggle
        if (!onChange || !multiple) return;

        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.filter(v => v !== optionValue);
        onChange(newValues);
    };

    // Normalize options to object format
    const normalizedOptions: Option[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const isSelected = (optionValue: string) => {
        if (multiple) {
            return Array.isArray(value) && value.includes(optionValue);
        }
        return value === optionValue;
    };

    // Render logic for trigger button content
    const renderTriggerContent = () => {
        if (multiple && Array.isArray(value) && value.length > 0) {
            return (
                <div className="flex flex-wrap gap-2">
                    {value.map(val => {
                        const label = normalizedOptions.find(o => o.value === val)?.label || val;
                        return (
                            <span
                                key={val}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-sm text-white border border-white/10"
                            >
                                {label}
                                <button
                                    type="button"
                                    onClick={(e) => handleRemove(e, val)}
                                    className="hover:text-orange transition-colors focus:outline-none"
                                    aria-label={`Remove ${label}`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        );
                    })}
                </div>
            );
        }

        // Single select or empty state
        const selectedLabel = normalizedOptions.find(opt => opt.value === value)?.label;
        return (
            <span className={`block truncate mr-4 ${selectedLabel ? 'text-white' : 'text-white/30'}`}>
                {selectedLabel || placeholder}
            </span>
        );
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Trigger Button */}
            <div
                id={id}
                className={`w-full bg-transparent border-b border-white py-3 cursor-pointer flex items-center justify-between group transition-colors min-h-[50px] ${isOpen ? 'border-orange' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1 mr-4">
                    {renderTriggerContent()}
                </div>

                {/* Arrow Icon */}
                <div className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-black-soft/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                    {normalizedOptions.map((option) => {
                        const selected = isSelected(option.value);
                        return (
                            <div
                                key={option.value}
                                className={`px-4 py-3 text-white cursor-pointer transition-colors duration-200 hover:bg-orange hover:text-white flex items-center justify-between
                                    ${selected ? 'bg-white/10' : ''}
                                `}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>
                                {selected && (
                                    <svg className="w-4 h-4 text-orange group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
