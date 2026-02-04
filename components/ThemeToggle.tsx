"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-20 h-8 border border-zinc-800 bg-zinc-900/50 animate-pulse" />
        );
    }

    // Theme is forced to light, so always show light mode
    const isDark = false;

    return (
        <div
            className="group relative w-20 h-8 border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-colors opacity-50 cursor-not-allowed"
            aria-label="Theme locked to light mode"
            title="Light mode only (dark mode coming soon)"
        >
            <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <span className="mono text-[8px] uppercase tracking-tighter text-[var(--primary)] font-bold">
                    LIGHT
                </span>
                <span className="mono text-[8px] uppercase tracking-tighter text-zinc-600">
                    DARK
                </span>
            </div>
            
            <motion.div
                className="absolute top-1 bottom-1 w-8 bg-[var(--primary)]/20 border border-[var(--primary)]/50"
                initial={{ left: "4px" }}
                animate={{ left: "4px" }}
            />
        </div>
    );
};
