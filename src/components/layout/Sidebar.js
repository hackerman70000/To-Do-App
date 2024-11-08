import React, { useEffect, useRef, useState } from 'react';

const SidebarItem = ({ label, onClick, isActive, count }) => (
  <div className="w-full px-3">
    <button
      onClick={onClick}
      className={`w-full h-full flex items-center justify-between p-2 rounded-md transition-colors relative z-10 ${
        isActive 
          ? 'bg-gray-100 text-neutral-dark' 
          : 'text-neutral-light hover:bg-gray-50'
      }`}
    >
      <span className="text-sm font-normal pointer-events-none">
        {label}
      </span>
      {count > 0 && (
        <span className="text-xs text-gray-400 ml-2 pointer-events-none">
          {count}
        </span>
      )}
    </button>
  </div>
);

const Sidebar = ({ onFilterChange, currentFilter, taskCounts = { 
  today: 5, 
  tomorrow: 2, 
  upcoming: 8,
  completed: 15 
} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (e.clientX <= 100) {
        setIsExpanded(true);
      } else if (isExpanded) {
        const sidebarElement = sidebarRef.current;
        const sidebarRect = sidebarElement?.getBoundingClientRect();
        
        if (sidebarRect) {
          const isOverSidebar = (
            e.clientX >= sidebarRect.left &&
            e.clientX <= sidebarRect.right &&
            e.clientY >= sidebarRect.top &&
            e.clientY <= sidebarRect.bottom
          );

          if (!isOverSidebar) {
            timeoutRef.current = setTimeout(() => {
              setIsExpanded(false);
            }, 300);
          }
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isExpanded]);

  const items = [
    { id: 'today', label: 'Today', count: taskCounts.today },
    { id: 'tomorrow', label: 'Tomorrow', count: taskCounts.tomorrow },
    { id: 'upcoming', label: 'Upcoming', count: taskCounts.upcoming },
    { id: 'completed', label: 'Completed', count: taskCounts.completed }
  ];

  return (
    <>
      {/* Hover trigger area */}
      <div 
        className="fixed left-0 top-0 w-[100px] h-screen bg-transparent z-30"
        role="presentation"
      />
      
      {/* Menu toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed z-50 p-2 text-xl text-neutral-light hover:text-neutral-dark hover:bg-gray-100 rounded-md transition-all duration-300 ${
          isExpanded 
            ? 'left-48'
            : 'left-4'
        }`}
      >
        ≡
      </button>
      
      {/* Sidebar content */}
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 overflow-hidden z-40 ${
          isExpanded ? 'w-56' : 'w-0'
        }`}
      >
        <div className="mt-14 w-56">
          <nav className="space-y-1 relative">
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                label={item.label}
                isActive={currentFilter === item.id}
                count={item.count}
                onClick={() => {
                  onFilterChange(item.id);
                  setIsExpanded(false);
                }}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;