import { format, isToday, isYesterday } from 'date-fns';
import { Check, Clock, Edit, Repeat, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import { PRIORITY_LEVELS, RECURRENCE_PATTERNS } from '../../constants/taskConstants';
import { DeleteConfirmDialog } from '../common/DeleteConfirmDialog';
import { PrioritySelect } from './components/PrioritySelect';
import { RecurrenceSelect } from './components/RecurrenceSelect';
import { TagInput } from './components/TagInput';

const TaskItem = ({ task, toggleTaskStatus, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const startEditing = () => {
    setEditedTask({...task});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedTask.title) return;
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, "MMM d, yyyy");
  };

  const clearDate = (e) => {
    e.preventDefault();
    setEditedTask(prev => ({
      ...prev,
      dueDate: '',
      dueTime: ''
    }));
  };

  const currentStatus = task.status;
  const isCompleted = currentStatus === 'completed';
  const isOverdue = currentStatus === 'overdue';

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              className="w-full p-2.5 rounded-lg border border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <input
              type="text"
              value={editedTask.details || ''}
              onChange={(e) => setEditedTask({...editedTask, details: e.target.value})}
              className="w-full p-2.5 rounded-lg border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <TagInput
              tags={editedTask.tags || []}
              setTags={(tags) => setEditedTask({...editedTask, tags})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <PrioritySelect
              value={editedTask.priority || 'medium'}
              onChange={(value) => setEditedTask({...editedTask, priority: value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={editedTask.dueDate || ''}
                  onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                  className="w-full p-2.5 pr-8 rounded-lg border border-gray-300"
                />
                {editedTask.dueDate && (
                  <button
                    onClick={clearDate}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    type="button"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={editedTask.dueTime || ''}
                onChange={(e) => setEditedTask({...editedTask, dueTime: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-gray-300"
                disabled={!editedTask.dueDate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
              <RecurrenceSelect
                value={editedTask.recurrence || 'none'}
                onChange={(value) => setEditedTask({...editedTask, recurrence: value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setEditedTask(task);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              type="button"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className="mt-1.5 flex-shrink-0"
        >
          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center
            ${isCompleted
              ? 'border-neutral-light bg-neutral-light text-white'
              : 'border-gray-400'}`}
          >
            {isCompleted && <Check size={14} />}
          </div>
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-semibold text-gray-800 ${
                  isCompleted ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                {task.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_LEVELS[task.priority.toUpperCase()].color}`}>
                    {PRIORITY_LEVELS[task.priority.toUpperCase()].label}
                  </span>
                )}
              </div>
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {task.details && (
                <p className={`text-gray-600 mt-2 ${
                  isCompleted ? 'line-through text-gray-400' : ''
                }`}>
                  {task.details}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2">
                {task.dueDate && (
                  <span className={`flex items-center gap-1.5 text-sm ${
                    isOverdue ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    <Clock size={14} />
                    {formatDate(task.dueDate)}
                    {task.dueTime && ` at ${task.dueTime}`}
                  </span>
                )}
                {task.recurrence && task.recurrence !== 'none' && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Repeat size={14} />
                    {RECURRENCE_PATTERNS[task.recurrence.toUpperCase()].label}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              {!isCompleted && (
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={startEditing}
                  aria-label="Edit task"
                >
                  <Edit size={18} />
                </button>
              )}
              {(isCompleted || isOverdue) && (
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  aria-label="Delete task"
                >
                  <X size={18} />
                </button>
              )}
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