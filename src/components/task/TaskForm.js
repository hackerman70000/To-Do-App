import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import TaskFormFields from './components/TaskFormFields';

const TaskForm = ({ newTask, setNewTask, addTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask();
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-5">
      <div 
        className="px-5 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-sm font-semibold text-gray-800">Add task</h2>
        <button 
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          aria-label={isExpanded ? "Collapse form" : "Expand form"}
        >
          {isExpanded ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="px-5 pb-3">
          <TaskFormFields
            task={newTask}
            onTaskChange={setNewTask}
            onSubmit={handleSubmit}
          />
        </form>
      )}
    </div>
  );
};

export default TaskForm;