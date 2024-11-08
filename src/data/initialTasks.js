const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

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
    details: "",
    dueDate: formatDate(yesterday),
    dueTime: "14:00",
    priority: "medium",
    tags: ["code-review", "collaboration"],
    recurrence: "daily",
    status: "overdue"
  },
  {
    id: 3,
    title: "Team daily meeting",
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
    details: "Create slides for the next sprint review meeting",
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
    details: "Create backup of codebase and documentation files",
    dueDate: formatDate(tomorrow),
    dueTime: "18:00",
    priority: "low",
    tags: ["maintenance", "backup"],
    recurrence: "weekly",
    status: "in_progress"
  },
  {
    id: 6,
    title: "Update dependencies",
    details: "Check and update all project dependencies to latest versions",
    dueDate: formatDate(today),
    dueTime: "",
    priority: "low",
    tags: ["maintenance", "dependencies"],
    recurrence: "monthly",
    status: "in_progress"
  },
  
  {
    id: 7,
    title: "Grocery shopping",
    details: "",
    dueDate: formatDate(today),
    dueTime: "",
    priority: "",
    tags: ["shopping", "groceries"],
    recurrence: "",
    status: "in_progress"
  },
  {
    id: 8,
    title: "Pick up dry cleaning",
    details: "Pick up suits from Green Clean - Ticket #4523",
    dueDate: formatDate(tomorrow),
    dueTime: "16:00",
    priority: "low",
    tags: ["errands"],
    recurrence: "none",
    status: "in_progress"
  },
  
  {
    id: 9,
    title: "Clean apartment",
    details: "",
    dueDate: formatDate(nextWeek),
    dueTime: "",
    priority: "",
    tags: ["home", "cleaning"],
    recurrence: "weekly",
    status: "in_progress"
  },
  {
    id: 10,
    title: "Pay utility bills",
    details: "",
    dueDate: formatDate(yesterday),
    dueTime: "",
    priority: "high",
    tags: ["bills", "finance"],
    recurrence: "monthly",
    status: "completed"
  },
  
  {
    id: 11,
    title: "Morning workout",
    details: "30-minute cardio and strength training session",
    dueDate: formatDate(today),
    dueTime: "07:00",
    priority: "",
    tags: ["health", "exercise"],
    recurrence: "daily",
    status: "completed"
  },
  
  {
    id: 13,
    title: "Read book chapter",
    details: "Read next chapter of East of Eden",
    dueDate: "",
    dueTime: "",
    priority: "low",
    tags: ["reading", "personal"],
    recurrence: "daily",
    status: "completed"
  },
  {
    id: 14,
    title: "Meditate",
    details: "10-minute guided meditation session",
    dueDate: formatDate(tomorrow),
    dueTime: "",
    priority: "medium",
    tags: ["learning", "language"],
    recurrence: "daily",
    status: "in_progress"
  },
  
  {
    id: 15,
    title: "Call parents",
    details: "Weekly catch-up call with mom and dad",
    dueDate: formatDate(nextWeek),
    dueTime: "",
    priority: "",
    tags: ["family", "personal"],
    recurrence: "weekly",
    status: "in_progress"
  },
  {
    id: 16,
    title: "Birthday gift for Tommy",
    details: "",
    dueDate: formatDate(nextWeek),
    dueTime: "",
    priority: "medium",
    tags: ["shopping", "gifts"],
    recurrence: "none",
    status: "in_progress"
  }
];