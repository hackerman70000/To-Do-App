import { ChevronDown } from 'lucide-react';
import React from 'react';
import { RECURRENCE_PATTERNS } from '../../../constants/taskConstants';

export const RecurrenceSelect = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[34px] appearance-none px-3 pr-8 rounded-md border border-gray-300 bg-white focus:border-neutral-light focus:ring-2 focus:ring-neutral-light/20 outline-none transition-colors text-sm"
      >
        {Object.values(RECURRENCE_PATTERNS).map((pattern) => (
          <option key={pattern.value} value={pattern.value}>
            {pattern.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <ChevronDown size={16} />
      </div>
    </div>
  );
};