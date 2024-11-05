import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, toggleTaskStatus, deleteTask, updateDifficulty, updateTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate + (a.dueTime ? `T${a.dueTime}` : 'T23:59:59'));
      const dateB = new Date(b.dueDate + (b.dueTime ? `T${b.dueTime}` : 'T23:59:59'));
      return dateA - dateB;
    }
    
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    return a.id - b.id;
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTaskStatus={toggleTaskStatus}
          deleteTask={deleteTask}
          updateDifficulty={updateDifficulty}
          updateTask={updateTask}
        />
      ))}
    </div>
  );
};

export default TaskList;