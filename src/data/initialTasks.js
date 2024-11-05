const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const formatDate = (date) => date.toISOString().split('T')[0];

export const initialTasks = [
  {
    id: 1,
    title: "Complete project documentation",
    details: "Write comprehensive documentation for the new features",
    dueDate: formatDate(tomorrow),
    dueTime: "17:00",
    priority: "high",
    tags: ["documentation", "project"],
    recurrence: "none",
    status: "in_progress"
  },
  {
    id: 2,
    title: "Review pull requests",
    details: "Go through pull requests from the team",
    dueDate: formatDate(yesterday),
    dueTime: "14:00",
    priority: "medium",
    tags: ["code-review", "collaboration"],
    recurrence: "daily",
    status: "overdue"
  },
  {
    id: 3,
    title: "Team standup meeting",
    details: "Daily team sync and progress update",
    dueDate: formatDate(today),
    dueTime: "10:00",
    priority: "medium",
    tags: ["meeting", "team"],
    recurrence: "daily",
    status: "in_progress"
  },
  {
    id: 4,
    title: "Prepare presentation",
    details: "Create slides for the next sprint review",
    dueDate: formatDate(nextWeek),
    dueTime: "10:00",
    priority: "high",
    tags: ["presentation", "sprint"],
    recurrence: "none",
    status: "in_progress"
  },
  {
    id: 5,
    title: "Weekly code backup",
    details: "Backup codebase and documentation",
    dueDate: formatDate(today),
    dueTime: "18:00",
    priority: "low",
    tags: ["maintenance", "backup"],
    recurrence: "weekly",
    status: "in_progress"
  },
  {
    id: 6,
    title: "Update dependencies",
    details: "Check and update project dependencies",
    dueDate: "",
    dueTime: "",
    priority: "low",
    tags: ["maintenance", "dependencies"],
    recurrence: "monthly",
    status: "completed"
  }
];    