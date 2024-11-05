import { AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';
import { PRIORITY_LEVELS } from '../../../constants/taskConstants';

export const PrioritySelect = ({ value, onChange }) => {
  const getIcon = (priority) => {
    switch (priority) {
      case 'high': return <ArrowUp className="text-red-600" size={16} />;
      case 'medium': return <AlertCircle className="text-yellow-600" size={16} />;
      case 'low': return <ArrowDown className="text-green-600" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="flex gap-2">
      {Object.values(PRIORITY_LEVELS).map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors
            ${value === level.value ? level.color : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
        >
          {getIcon(level.value)}
          {level.label}
        </button>
      ))}
    </div>
  );
};