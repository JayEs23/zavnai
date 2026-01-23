export const TIME_SLOTS = [
  { id: '06:00', label: 'Morning' },
  { id: '10:00', label: 'Deep Work' },
  { id: '14:00', label: 'Afternoon' },
  { id: '18:00', label: 'Evening' },
  { id: '22:00', label: 'Night' },
];

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const PATTERNS = {
  obstacles: [
    { id: 'proc', label: 'Procrastination', icon: 'timer_off' },
    { id: 'over', label: 'Over-committing', icon: 'priority_high' },
    { id: 'pres', label: 'External Pressure', icon: 'groups' },
    { id: 'shiny', label: 'Shiny Object Syndrome', icon: 'bolt' },
    { id: 'scope', label: 'Scope Creep', icon: 'trending_up' },
  ],
  wins: [
    { id: 'flow', label: 'Hyper-focus', icon: 'auto_awesome' },
    { id: 'deep', label: 'Deep Work Sprints', icon: 'psychology' },
    { id: 'prior', label: 'Strict Prioritization', icon: 'checklist' },
  ]
};

export const VERIFICATION_OPTIONS = [
  { id: 'echo', title: 'Self-Reflection', desc: 'Daily check-ins with Echo.' },
  { id: 'data', title: 'Behavioral Data', desc: 'Sync health & productivity apps.' },
  { id: 'tribe', title: 'Tribe Verification', desc: 'Social accountability via Mirror.' },
] as const;

