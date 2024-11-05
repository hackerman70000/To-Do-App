import { X } from 'lucide-react';
import React, { useState } from 'react';

export const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-red-500"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Add tags..." : ""}
        className="flex-1 min-w-[120px] outline-none bg-transparent"
      />
    </div>
  );
};