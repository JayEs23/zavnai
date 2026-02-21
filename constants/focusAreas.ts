/**
 * ZAVN Focus Areas - Core domains where users can achieve their goals
 */

export const FOCUS_AREAS = [
  {
    id: "productivity",
    name: "Productivity & Work Habits",
    description: "Build better work routines, manage time effectively, and achieve professional goals",
    icon: "💼",
    color: "from-primary to-teal-600",
  },
  {
    id: "health",
    name: "Health, Fitness & Wellness",
    description: "Improve physical health, build fitness habits, and prioritize wellness",
    icon: "💪",
    color: "from-secondary to-emerald-600",
  },
  {
    id: "financial",
    name: "Financial Health",
    description: "Build better money habits, save more, and achieve financial goals",
    icon: "💰",
    color: "from-accent to-purple-600",
  },
  {
    id: "learning",
    name: "Personal Growth & Learning",
    description: "Learn new skills, read more, and invest in personal development",
    icon: "📚",
    color: "from-success to-green-600",
  },
  {
    id: "relationships",
    name: "Relationships, Social Growth & Community Impact",
    description: "Strengthen relationships, build social connections, and make a positive impact",
    icon: "🤝",
    color: "from-warning to-yellow-600",
  },
] as const;

export type FocusAreaId = typeof FOCUS_AREAS[number]["id"];

