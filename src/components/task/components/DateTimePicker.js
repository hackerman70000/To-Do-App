import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Calendar, Clock, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
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

const getClosestTimeOption = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  const hour = now.getHours();
  
  const adjustedHour = roundedMinutes === 60 ? (hour + 1) % 24 : hour;
  const adjustedMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
  
  return `${adjustedHour.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
};

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }
  return options;
};

const validateTimeInput = (value) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(value);
};

const formatTimeInput = (value) => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  const hours = numbers.slice(0, 2);
  const minutes = numbers.slice(2, 4);
  return `${hours}:${minutes}`;
};

export const DateTimePicker = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange,
  isOverdue = false 
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeInput, setTimeInput] = useState(time || '');
  const dateInputRef = useRef(null);
  const timePickerRef = useRef(null);
  const timeListRef = useRef(null);
  const timeInputRef = useRef(null);
  const closestTime = getClosestTimeOption();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setTimeInput(time || '');
  }, [time]);

  useEffect(() => {
    if (showTimePicker && timeListRef.current) {
      const closestTimeElement = timeListRef.current.querySelector(`[data-time="${closestTime}"]`);
      if (closestTimeElement) {
        requestAnimationFrame(() => {
          timeListRef.current.scrollTop = closestTimeElement.offsetTop - 4;
        });
      }
    }
  }, [showTimePicker, closestTime]);

  const handleTimeInputChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatTimeInput(rawValue);
    setTimeInput(formattedValue);
    
    if (validateTimeInput(formattedValue)) {
      onTimeChange(formattedValue);
    }
  };

  const handleTimeInputKeyDown = (e) => {
    if (e.key === 'Enter' && validateTimeInput(timeInput)) {
      onTimeChange(timeInput);
      setShowTimePicker(false);
      timeInputRef.current?.blur();
    }
  };

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleTimeClick = () => {
    if (date) {
      setShowTimePicker(true);
    }
  };

  return (
    <div className="grid grid-cols-[1.5fr,1.5fr] gap-4">
      <div>
        <div className="relative flex items-center">
          <input
            ref={dateInputRef}
            type="date"
            className="sr-only"
            value={date || ''}
            onChange={(e) => onDateChange(e.target.value)}
          />
          <div 
            className="w-full h-[38px] px-3 rounded-lg border border-gray-300 focus-within:border-neutral-light focus-within:ring-2 focus-within:ring-neutral-light/20 transition-colors bg-white flex items-center cursor-pointer"
            onClick={handleDateClick}
          >
            <span className={`flex-grow ${isOverdue ? 'text-red-500' : ''}`}>
              {date ? formatDisplayDate(date) : 'Due date'}
            </span>
            <div className="flex items-center gap-1 ml-2">
              {date && (
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Clear date"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dateInputRef.current.value = '';
                    onDateChange('');
                  }}
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
              <Calendar size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative" ref={timePickerRef}>
        <div 
          className="w-full h-[38px] px-3 rounded-lg border border-gray-300 focus-within:border-neutral-light focus-within:ring-2 focus-within:ring-neutral-light/20 transition-colors bg-white flex items-center cursor-pointer"
          onClick={handleTimeClick}
        >
          <input
            ref={timeInputRef}
            type="text"
            placeholder="--:--"
            value={timeInput}
            onChange={handleTimeInputChange}
            onKeyDown={handleTimeInputKeyDown}
            className="flex-grow bg-transparent outline-none cursor-pointer"
            maxLength={5}
          />
          <div className="flex items-center gap-1">
            {timeInput && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTimeChange('');
                  setTimeInput('');
                }}
                type="button"
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Clear time"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
            <Clock size={16} className="text-gray-500" />
          </div>
        </div>
        
        {showTimePicker && date && (
          <div 
            ref={timeListRef}
            className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {generateTimeOptions().map((timeOption) => {
              const isClosestTimeOption = timeOption === closestTime;
              return (
                <button
                  key={timeOption}
                  type="button"
                  data-time={timeOption}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 text-sm ${
                    isClosestTimeOption ? 'bg-gray-50 font-medium' : ''
                  }`}
                  onClick={() => {
                    onTimeChange(timeOption);
                    setTimeInput(timeOption);
                    setShowTimePicker(false);
                  }}
                >
                  {timeOption}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;