import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { DateTimePicker } from './components/DateTimePicker';
import { TagInput } from './components/TagInput';

const TaskForm = ({ newTask, setNewTask, addTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [textareaRows, setTextareaRows] = useState(1);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!newTask.details) {
      setTextareaRows(1);
    }
  }, [newTask.details]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = e.target.value.substring(0, cursorPosition);
      const textAfterCursor = e.target.value.substring(cursorPosition);
      
      const newText = textBeforeCursor + '\n' + textAfterCursor;
      setNewTask({ ...newTask, details: newText });
      
      setTextareaRows(prev => prev + 1);
      
      setTimeout(() => {
        e.target.selectionStart = cursorPosition + 1;
        e.target.selectionEnd = cursorPosition + 1;
      }, 0);
    } else if (e.key === 'Backspace' && textareaRef.current) {
      const lines = textareaRef.current.value.split('\n');
      if (
        e.target.selectionStart === e.target.selectionEnd &&
        e.target.selectionStart > 0 &&
        e.target.value[e.target.selectionStart - 1] === '\n' &&
        lines.length > 1
      ) {
        setTextareaRows(prev => Math.max(1, prev - 1));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask();
    setTextareaRows(1);
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
              className="w-full px-3 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors h-[38px]"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                placeholder="Enter task details"
                className="w-full px-3 rounded-lg border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors resize-none overflow-hidden block"
                value={newTask.details}
                onChange={(e) => setNewTask({...newTask, details: e.target.value})}
                onKeyDown={handleKeyDown}
                style={{ 
                  height: `${Math.max(38, textareaRows * 24)}px`,
                  minHeight: '38px',
                  lineHeight: '38px',
                  paddingTop: '0',
                  paddingBottom: '0'
                }}
              />
            </div>

            <div className="grid grid-cols-[1fr,200px] gap-4">
              <DateTimePicker
                date={newTask.dueDate}
                time={newTask.dueTime}
                onDateChange={(date) => setNewTask({...newTask, dueDate: date})}
                onTimeChange={(time) => setNewTask({...newTask, dueTime: time})}
              />

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