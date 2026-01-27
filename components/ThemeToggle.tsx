"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="size-10 rounded-lg icon-container">
                <div className="h-5 w-5 bg-[var(--border-subtle)] rounded-full animate-pulse" />
            </div>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative size-10 rounded-lg icon-container hover:bg-[var(--border-subtle)] transition-colors"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Moon className="h-5 w-5 text-slate-100" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Sun className="h-5 w-5 text-slate-900" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};
