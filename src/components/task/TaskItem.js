import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Check, Clock, Edit, Repeat, X } from 'lucide-react';
import React, { useState } from 'react';
import { PRIORITY_LEVELS, RECURRENCE_PATTERNS } from '../../constants/taskConstants';
import { DeleteConfirmDialog } from '../common/DeleteConfirmDialog';
import TaskFormFields from './components/TaskFormFields';

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, "d MMM yyyy");
};

const TaskItem = ({ task, toggleTaskStatus, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = () => {
    if (!editedTask.title) return;
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const currentStatus = task.status;
  const isCompleted = currentStatus === 'completed';
  const isOverdue = currentStatus === 'overdue';

  if (isEditing) {
    return (
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5">
        <TaskFormFields
          task={editedTask}
          onTaskChange={setEditedTask}
          onSubmit={handleSave}
          onCancel={() => {
            setEditedTask(task);
            setIsEditing(false);
          }}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-md shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className="mt-1 flex-shrink-0"
        >
          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center
            ${isCompleted
              ? 'border-neutral-light bg-neutral-light text-white'
              : 'border-gray-400'}`}
          >
            {isCompleted && <Check size={12} />}
          </div>
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-medium text-gray-800 ${
                  isCompleted ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                {task.priority && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    PRIORITY_LEVELS[task.priority.toUpperCase()].color
                  }`}>
                    {PRIORITY_LEVELS[task.priority.toUpperCase()].label}
                  </span>
                )}
              </div>
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {task.details && (
                <p className={`text-sm text-gray-600 mt-1.5 ${
                  isCompleted ? 'line-through text-gray-400' : ''
                }`}>
                  {task.details}
                </p>
              )}

              <div className="flex items-center gap-2 mt-1.5">
                {task.dueDate && (
                  <span className={`flex items-center gap-1 text-xs ${
                    isOverdue ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    <Clock size={12} />
                    {formatDisplayDate(task.dueDate)}
                    {task.dueTime && ` at ${task.dueTime}`}
                  </span>
                )}
                {task.recurrence && task.recurrence !== 'none' && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Repeat size={12} />
                    {RECURRENCE_PATTERNS[task.recurrence.toUpperCase()].label}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsEditing(true)}
                aria-label="Edit task"
              >
                <Edit size={14} />
              </button>
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsDeleteDialogOpen(true)}
                aria-label="Delete task"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteTask(task.id);
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

export default TaskItem;