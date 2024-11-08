import React from 'react';
import TaskItem from './TaskItem';

const EmptyState = ({ filter }) => {
  let message = "No tasks found";
  switch (filter) {
    case 'today':
      message = "You have no tasks scheduled for today";
      break;
    case 'tomorrow':
      message = "You have no tasks scheduled for tomorrow";
      break;
    case 'week':
      message = "You have no tasks scheduled for this week";
      break;
    case 'completed':
      message = "You have no completed tasks";
      break;
    default:
      message = "You have no tasks";
  }
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

const TaskList = ({ tasks, toggleTaskStatus, deleteTask, updateTask, filter }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    const dateA = new Date(a.dueDate + (a.dueTime ? `T${a.dueTime}` : 'T23:59:59'));
    const dateB = new Date(b.dueDate + (b.dueTime ? `T${b.dueTime}` : 'T23:59:59'));
    return dateA - dateB;
  });

  return (
    <div className="space-y-3">
      {sortedTasks.length > 0 ? (
        sortedTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTaskStatus={toggleTaskStatus}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))
      ) : (
        <EmptyState filter={filter} />
      )}
    </div>
  );
};

export default TaskList;