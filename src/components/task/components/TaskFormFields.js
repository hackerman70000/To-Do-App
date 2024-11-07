import { Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { DateTimePicker } from './DateTimePicker';
import { TagInput } from './TagInput';

const TaskFormFields = ({ 
  task, 
  onTaskChange, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const [textareaRows, setTextareaRows] = useState(1);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!task.details) {
      setTextareaRows(1);
    }
  }, [task.details]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = e.target.value.substring(0, cursorPosition);
      const textAfterCursor = e.target.value.substring(cursorPosition);
      
      const newText = textBeforeCursor + '\n' + textAfterCursor;
      onTaskChange({ ...task, details: newText });
      
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

  return (
    <div className="grid grid-cols-1 gap-3">
      <input
        type="text"
        placeholder="Enter task title"
        className="w-full px-3 rounded-md border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors h-[34px] text-sm"
        value={task.title}
        onChange={(e) => onTaskChange({...task, title: e.target.value})}
      />
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          placeholder="Enter task details"
          className="w-full px-3 rounded-md border border-gray-300 focus:border-neutral-focus-border focus:ring-2 focus:ring-neutral-focus-ring/30 outline-none transition-colors resize-none overflow-hidden block text-sm"
          value={task.details}
          onChange={(e) => onTaskChange({...task, details: e.target.value})}
          onKeyDown={handleKeyDown}
          style={{ 
            height: `${Math.max(34, textareaRows * 22)}px`,
            minHeight: '34px',
            lineHeight: '22px',
            paddingTop: '6px',
            paddingBottom: '6px'
          }}
        />
      </div>

      <div className="grid grid-cols-[1fr,180px] gap-3">
        <DateTimePicker
          date={task.dueDate}
          time={task.dueTime}
          onDateChange={(date) => onTaskChange({...task, dueDate: date})}
          onTimeChange={(time) => onTaskChange({...task, dueTime: time})}
        />

        <select
          value={task.recurrence || 'none'}
          onChange={(e) => onTaskChange({...task, recurrence: e.target.value})}
          className="w-full h-[34px] px-3 rounded-md border border-gray-300 focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors bg-white text-sm"
        >
          <option value="none">No repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="grid grid-cols-[1fr,180px] gap-3">
        <TagInput
          tags={task.tags || []}
          setTags={(tags) => onTaskChange({...task, tags})}
        />
        
        <div className="flex gap-2 items-center h-[34px]">
          {['High', 'Medium', 'Low'].map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => {
                if (task.priority === priority.toLowerCase()) {
                  onTaskChange({...task, priority: ''});
                } else {
                  onTaskChange({...task, priority: priority.toLowerCase()});
                }
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs ${
                task.priority === priority.toLowerCase()
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
        {isEditing ? (
          <div className="flex gap-2 w-[180px]">
            <button
              onClick={onCancel}
              className="flex-1 h-[34px] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 h-[34px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              type="button"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={onSubmit}
            className="w-[180px] bg-neutral-light hover:bg-neutral-dark text-white h-[34px] rounded-md flex items-center justify-center gap-2 transition-colors text-sm"
            type="button"
          >
            <Plus size={16} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFormFields;