'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdExpandMore } from 'react-icons/md';
import { GoalSummary } from '@/services/goalsApi';

export function CreateCommitmentGoalSelector({
  goals,
  variant,
}: {
  goals: GoalSummary[];
  variant: 'button' | 'card';
}) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeGoals = goals.filter((g) => g.status === 'active');

  if (goals.length === 0) {
    return (
      <Link
        href="/echo"
        className={
          variant === 'button'
            ? 'inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm'
            : 'flex items-center gap-4 p-4 rounded-xl border border-border hover:border-secondary/30 hover:bg-secondary/5 transition-all group'
        }
      >
        {variant === 'card' && (
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MdCheckCircle className="text-secondary" size={24} />
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground text-sm">Create commitment with Doyn</p>
          <p className="text-xs text-muted-foreground">Create a goal with Echo first</p>
        </div>
      </Link>
    );
  }

  if (activeGoals.length === 0) {
    return (
      <Link
        href="/echo"
        className={
          variant === 'button'
            ? 'inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm'
            : 'flex items-center gap-4 p-4 rounded-xl border border-border hover:border-secondary/30 hover:bg-secondary/5 transition-all group'
        }
      >
        {variant === 'card' && (
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MdCheckCircle className="text-secondary" size={24} />
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground text-sm">Create commitment with Doyn</p>
          <p className="text-xs text-muted-foreground">Create an active goal with Echo first</p>
        </div>
      </Link>
    );
  }

  if (activeGoals.length === 1) {
    return (
      <Link
        href={`/doyn/${activeGoals[0].id}`}
        className={
          variant === 'button'
            ? 'inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm'
            : 'flex items-center gap-4 p-4 rounded-xl border border-border hover:border-secondary/30 hover:bg-secondary/5 transition-all group'
        }
      >
        {variant === 'button' && <MdCheckCircle size={18} />}
        {variant === 'card' && (
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MdCheckCircle className="text-secondary" size={24} />
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground text-sm">Create commitment with Doyn</p>
          <p className="text-xs text-muted-foreground">
            {variant === 'button' ? 'Turn goals into actions' : `For: ${activeGoals[0].title}`}
          </p>
        </div>
      </Link>
    );
  }

  const buttonClass =
    variant === 'button'
      ? 'inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm'
      : 'flex items-center gap-4 p-4 rounded-xl border border-border hover:border-secondary/30 hover:bg-secondary/5 transition-all group w-full text-left';

  return (
    <div className="relative">
      <button type="button" onClick={() => setDropdownOpen((o) => !o)} className={buttonClass}>
        {variant === 'button' && <MdCheckCircle size={18} />}
        {variant === 'card' && (
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <MdCheckCircle className="text-secondary" size={24} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">Create commitment with Doyn</p>
          <p className="text-xs text-muted-foreground">Select a goal</p>
        </div>
        <MdExpandMore className={`flex-shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={20} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <>
            <button
              type="button"
              aria-label="Close dropdown"
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute z-50 mt-2 w-full min-w-[220px] bg-white rounded-xl border border-border shadow-lg overflow-hidden"
            >
              <div className="py-1 max-h-60 overflow-y-auto">
                {activeGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push(`/doyn/${goal.id}`);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <span className="font-medium text-foreground truncate">{goal.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
