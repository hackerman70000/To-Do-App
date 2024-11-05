import React from 'react';
import { RECURRENCE_PATTERNS } from '../../../constants/taskConstants';

export const RecurrenceSelect = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
    >
      {Object.values(RECURRENCE_PATTERNS).map((pattern) => (
        <option key={pattern.value} value={pattern.value}>
          {pattern.label}
        </option>
      ))}
    </select>
  );
};