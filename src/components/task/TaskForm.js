import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp, Clock, GripVertical, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { TagInput } from './components/TagInput';

const TaskForm = ({ newTask, setNewTask, addTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask();
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), "d MMM yyyy");
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

  const clearTime = (e) => {
    e.preventDefault();
    setNewTask(prev => ({
      ...prev,
      dueTime: ''
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div 
        className="px-6 py-4 flex justify-between items-center cursor-pointer"
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

      {isExpanded && (
        <form onSubmit={handleSubmit} className="px-6 pb-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full p-2 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors h-[38px]"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            
            <div className="relative">
              <textarea
                placeholder="Enter task details"
                className={`w-full p-2 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors resize-none ${isDetailsExpanded ? 'h-24' : 'h-[38px]'}`}
                value={newTask.details}
                onChange={(e) => setNewTask({...newTask, details: e.target.value})}
              />
              <button
                type="button"
                className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" // Changed from 'top-1/2 -translate-y-1/2' to 'top-2'
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                aria-label="Expand details"
              >
                <GripVertical size={16} />
              </button>
            </div>

            <div className="grid grid-cols-[1.5fr,1.5fr,200px] gap-4">
              <div>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    className="sr-only"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                  <div 
                    className="w-full h-[38px] px-3 rounded-lg border border-gray-300 focus-within:border-neutral-light focus-within:ring-2 focus-within:ring-neutral-light/20 transition-colors bg-white flex items-center cursor-pointer"
                    onClick={() => document.querySelector('input[type="date"]').showPicker()}
                  >
                    <span className="flex-grow">
                      {formatDisplayDate(newTask.dueDate)}
                    </span>
                    <div className="flex items-center gap-1">
                      {newTask.dueDate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearDate(e);
                          }}
                          type="button"
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      )}
                      <Calendar size={16} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="time"
                  placeholder="--:-- --"
                  className="w-full h-[38px] px-3 rounded-lg border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors pr-16"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                  disabled={!newTask.dueDate}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {newTask.dueTime && (
                    <button
                      onClick={clearTime}
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  )}
                  <Clock size={16} className="text-gray-500" />
                </div>
              </div>

              <select
                value={newTask.recurrence || 'none'}
                onChange={(e) => setNewTask({...newTask, recurrence: e.target.value})}
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
                tags={newTask.tags || []}
                setTags={(tags) => setNewTask({...newTask, tags})}
              />
              
              <div className="flex gap-2 items-center h-[38px]">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => {
                      if (newTask.priority === priority.toLowerCase()) {
                        setNewTask({...newTask, priority: ''});
                      } else {
                        setNewTask({...newTask, priority: priority.toLowerCase()});
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newTask.priority === priority.toLowerCase()
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
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-[200px] bg-neutral-light hover:bg-neutral-dark text-white h-[38px] rounded-lg flex items-center justify-center gap-2 transition-colors"
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