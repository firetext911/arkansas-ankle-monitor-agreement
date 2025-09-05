import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown } from 'lucide-react';

export default function CollapsibleSection({ title, children, defaultOpen = true }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn(
            "border border-gray-200 rounded-xl bg-white transition-all duration-300",
            isOpen ? "shadow-lg border-purple-200" : "shadow-sm"
        )}>
            <button
                type="button"
                className="w-full flex justify-between items-center text-left px-6 py-4 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-lg font-semibold text-purple-700">
                    {title}
                </h2>
                <ChevronDown className={cn("w-6 h-6 text-purple-500 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <div
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{
                    maxHeight: isOpen ? '5000px' : '0px',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div className="p-6 border-t border-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );
}