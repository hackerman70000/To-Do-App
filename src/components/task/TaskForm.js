import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { TagInput } from './components/TagInput';

const TaskForm = ({ newTask, setNewTask, addTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask();
  };

  const PrioritySelect = ({ value, onChange }) => {
    return (
      <div className="flex gap-2 h-[42px] items-center w-[200px]">
        {['High', 'Medium', 'Low'].map((priority) => (
          <button
            key={priority}
            type="button"
            onClick={() => onChange(priority.toLowerCase())}
            className={`px-3 py-1 rounded-full text-sm ${
              value === priority.toLowerCase()
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
    );
  };

  const clearDate = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setNewTask(prev => ({
      ...prev,
      dueDate: '',
      dueTime: ''
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      {/* Header with collapse button */}
      <div 
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-800">Add task</h2>
        <button 
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isExpanded ? "Collapse form" : "Expand form"}
        >
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Collapsible form content */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            {/* Details field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                placeholder="Enter task details"
                rows={3}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors resize-y"
                value={newTask.details}
                onChange={(e) => setNewTask({...newTask, details: e.target.value})}
              />
            </div>

            {/* Date, Time, and Repeat row */}
            <div className="grid grid-cols-[1.5fr,1.5fr,200px] gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="w-full h-10 pl-3 pr-12 rounded-lg border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors appearance-none"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                  <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                    {newTask.dueDate && (
                      <button
                        onClick={clearDate}
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded-full mr-1"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  placeholder="--:-- --"
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                  disabled={!newTask.dueDate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat
                </label>
                <select
                  value={newTask.recurrence || 'none'}
                  onChange={(e) => setNewTask({...newTask, recurrence: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors bg-white"
                >
                  <option value="none">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Tags and Priority row */}
            <div className="grid grid-cols-[1fr,200px] gap-4 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (projects dropdown)
                </label>
                <TagInput
                  tags={newTask.tags || []}
                  setTags={(tags) => setNewTask({...newTask, tags})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <PrioritySelect
                  value={newTask.priority || 'medium'}
                  onChange={(value) => setNewTask({...newTask, priority: value})}
                />
              </div>
            </div>
            
            {/* Add task button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-[200px] bg-neutral-light hover:bg-neutral-dark text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add task
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;