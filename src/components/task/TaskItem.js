import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Check, Clock, Edit, GripVertical, Repeat, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PRIORITY_LEVELS, RECURRENCE_PATTERNS } from '../../constants/taskConstants';
import { DeleteConfirmDialog } from '../common/DeleteConfirmDialog';
import { DateTimePicker } from './components/DateTimePicker';
import { TagInput } from './components/TagInput';

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

const determineTaskStatus = (task) => {
  if (task.status === 'completed') return 'completed';
  if (!task.dueDate) return 'in_progress';
  
  const dueDateTime = task.dueTime 
    ? new Date(`${task.dueDate}T${task.dueTime}`)
    : new Date(`${task.dueDate}T23:59:59`);
    
  return dueDateTime < new Date() ? 'overdue' : 'in_progress';
};

const TaskItem = ({ task, toggleTaskStatus, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const startEditing = () => {
    setEditedTask({...task});
    setIsEditing(true);
  };

  const handleDateChange = useCallback((date) => {
    const updatedTask = {
      ...editedTask,
      dueDate: date
    };
    updatedTask.status = determineTaskStatus(updatedTask);
    setEditedTask(updatedTask);
  }, [editedTask]);

  const handleTimeChange = useCallback((time) => {
    const updatedTask = {
      ...editedTask,
      dueTime: time
    };
    updatedTask.status = determineTaskStatus(updatedTask);
    setEditedTask(updatedTask);
  }, [editedTask]);

  const handleSave = () => {
    if (!editedTask.title) return;
    
    const finalTask = {
      ...editedTask,
      status: determineTaskStatus(editedTask)
    };
    
    updateTask(task.id, finalTask);
    setIsEditing(false);
  };

  const currentStatus = task.status;
  const isCompleted = currentStatus === 'completed';
  const isOverdue = currentStatus === 'overdue';

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={editedTask.title}
            placeholder="Enter task title"
            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            className="w-full p-2 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors h-[38px]"
          />
          
          <div className="relative">
            <textarea
              placeholder="Enter task details"
              className={`w-full p-2 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors resize-none ${isDetailsExpanded ? 'h-24' : 'h-[38px]'}`}
              value={editedTask.details || ''}
              onChange={(e) => setEditedTask({...editedTask, details: e.target.value})}
            />
            <button
              type="button"
              className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              aria-label="Expand details"
            >
              <GripVertical size={16} />
            </button>
          </div>

          <div className="grid grid-cols-[1fr,200px] gap-4">
            <DateTimePicker
              date={editedTask.dueDate}
              time={editedTask.dueTime}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              isOverdue={editedTask.status === 'overdue'}
            />

            <select
              value={editedTask.recurrence || 'none'}
              onChange={(e) => setEditedTask({...editedTask, recurrence: e.target.value})}
              className="w-full h-[38px] px-3 rounded-lg border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors bg-white"
            >
              <option value="none">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="grid grid-cols-[1fr,200px] gap-4">
            <TagInput
              tags={editedTask.tags || []}
              setTags={(tags) => setEditedTask({...editedTask, tags})}
            />
            
            <div className="flex gap-2 items-center h-[38px]">
              {['High', 'Medium', 'Low'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => {
                    if (editedTask.priority === priority.toLowerCase()) {
                      setEditedTask({...editedTask, priority: ''});
                    } else {
                      setEditedTask({...editedTask, priority: priority.toLowerCase()});
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    editedTask.priority === priority.toLowerCase()
                      ? priority === 'High'
                        ? 'bg-red-50 text-red-700'
                        : priority === 'Medium'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-[1fr,200px] gap-4">
            <div /> {/* Empty div for grid alignment */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditedTask(task);
                  setIsEditing(false);
                }}
                className="flex-1 h-[38px] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-[38px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                type="button"
              >
                Save
              </button>
            </div>
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
                    {formatDisplayDate(task.dueDate)}
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