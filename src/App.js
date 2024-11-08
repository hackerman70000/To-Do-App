import { addDays, isAfter, isEqual, startOfDay } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DeleteConfirmDialog } from './components/common/DeleteConfirmDialog';
import Sidebar from './components/layout/Sidebar';
import TaskForm from './components/task/TaskForm';
import TaskList from './components/task/TaskList';
import { initialTasks } from './data/initialTasks';

const CURRENT_VERSION = '1.0';

const getViewTitle = (filter) => {
  if (!filter) return 'All Tasks';
  return filter.charAt(0).toUpperCase() + filter.slice(1);
};

function AppContent() {
  const location = useLocation();
  const currentFilter = location.pathname.slice(1) || '';
  const navigate = useNavigate();

  const [newTask, setNewTask] = useState({
    title: '',
    details: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    priority: '',
    tags: [],
    recurrence: 'none'
  });

  const [isDeleteCompletedDialogOpen, setIsDeleteCompletedDialogOpen] = useState(false);

  const determineTaskStatus = useCallback((task, now = new Date()) => {
    if (task.status === 'completed') return 'completed';
    if (!task.dueDate) return 'in_progress';
    
    const dueDateTime = task.dueTime 
      ? new Date(`${task.dueDate}T${task.dueTime}`)
      : new Date(`${task.dueDate}T23:59:59`);
      
    return dueDateTime < now ? 'overdue' : 'in_progress';
  }, []);

  const evaluateTaskStatuses = useCallback((tasksToEvaluate) => {
    const now = new Date();
    return tasksToEvaluate.map(task => ({
      ...task,
      status: determineTaskStatus(task, now)
    }));
  }, [determineTaskStatus]);

  const [tasks, setTasks] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('tasksVersion');
      const savedTasks = localStorage.getItem('tasks');
      
      if (!storedVersion || storedVersion !== CURRENT_VERSION || !savedTasks) {
        localStorage.removeItem('tasks');
        localStorage.removeItem('tasksVersion');
        localStorage.setItem('tasksVersion', CURRENT_VERSION);
        return evaluateTaskStatuses(initialTasks);
      }
      
      return evaluateTaskStatuses(JSON.parse(savedTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return evaluateTaskStatuses(initialTasks);
    }
  });

  const filterTasks = useCallback((tasks, filter) => {
    if (!filter) return tasks;
  
    if (filter === 'completed') {
      return tasks.filter(task => task.status === 'completed');
    }
  
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = startOfDay(addDays(today, 1));
  
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = startOfDay(new Date(task.dueDate));
      const isTaskOverdue = task.status === 'overdue';
  
      switch (filter) {
        case 'overdue':
          return isTaskOverdue && !isEqual(taskDate, today);
        case 'today':
          return isEqual(taskDate, today);
        case 'tomorrow':
          return isEqual(taskDate, tomorrow) && !isTaskOverdue;
        case 'upcoming':
          return isAfter(taskDate, tomorrow) && !isTaskOverdue;
        default:
          return true;
      }
    });
  }, []);

  const filteredTasks = filterTasks(tasks, currentFilter);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => evaluateTaskStatuses(prevTasks));
    }, 60000);
    return () => clearInterval(interval);
  }, [evaluateTaskStatuses]);

  const addTask = useCallback(() => {
    if (!newTask.title) return;

    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      status: 'in_progress'
    };

    if (taskToAdd.recurrence !== 'none') {
      taskToAdd.originalDueDate = taskToAdd.dueDate;
    }

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, taskToAdd];
      return evaluateTaskStatuses(updatedTasks);
    });

    setNewTask({
      title: '',
      details: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
      priority: '',
      tags: [],
      recurrence: 'none'
    });
  }, [newTask, evaluateTaskStatuses]);

  const calculateNextDueDate = (currentDate, recurrence) => {
    const date = new Date(currentDate);
    switch (recurrence) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        return currentDate;
    }
    return date.toISOString().split('T')[0];
  };

  const toggleTaskStatus = useCallback((taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status === 'completed') {
            const updatedTask = { ...task, status: 'in_progress' };
            return {
              ...updatedTask,
              status: determineTaskStatus(updatedTask)
            };
          } else {
            if (task.recurrence !== 'none') {
              const completedTask = { ...task, status: 'completed' };
              const nextDueDate = calculateNextDueDate(task.dueDate, task.recurrence);
              const nextTask = {
                ...task,
                id: Date.now(),
                dueDate: nextDueDate,
                status: 'in_progress'
              };
              return [completedTask, nextTask];
            }
            return { ...task, status: 'completed' };
          }
        }
        return task;
      });

      const flattenedTasks = updatedTasks.flat();
      return evaluateTaskStatuses(flattenedTasks);
    });
  }, [determineTaskStatus, evaluateTaskStatuses]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const deleteDoneTasks = useCallback(() => {
    setTasks(prevTasks => prevTasks.filter(task => task.status !== 'completed'));
    setIsDeleteCompletedDialogOpen(false);
  }, []);

  const updateTask = useCallback((taskId, updatedFields) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updatedFields };
        }
        return task;
      });
      return evaluateTaskStatuses(updatedTasks);
    });
  }, [evaluateTaskStatuses]);

  const resetToInitialTasks = useCallback(() => {
    localStorage.removeItem('tasks');
    localStorage.removeItem('tasksVersion');
    localStorage.setItem('tasksVersion', CURRENT_VERSION);
    setTasks(evaluateTaskStatuses(initialTasks));
  }, [evaluateTaskStatuses]);

  const taskCounts = {
    overdue: filterTasks(tasks, 'overdue').length,
    today: filterTasks(tasks, 'today').length,
    tomorrow: filterTasks(tasks, 'tomorrow').length,
    upcoming: filterTasks(tasks, 'upcoming').length,
    completed: tasks.filter(task => task.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        onFilterChange={(filter) => navigate(`/${filter}`)} 
        currentFilter={currentFilter}
        taskCounts={taskCounts}
      />
      
      <div className="pl-14 transition-all">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {getViewTitle(currentFilter)}
            </h1>
          </div>
          
          {currentFilter !== 'completed' && (
            <TaskForm
              newTask={newTask}
              setNewTask={setNewTask}
              addTask={addTask}
            />
          )}
          
          <TaskList
            tasks={filteredTasks}
            toggleTaskStatus={toggleTaskStatus}
            deleteTask={deleteTask}
            updateTask={updateTask}
            filter={currentFilter}
          />
          
          {filteredTasks.length > 0 && (
            <div className="mt-6 flex justify-center gap-3">
              {currentFilter !== 'completed' && (
                <button
                  onClick={resetToInitialTasks}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Reset to Default Tasks
                </button>
              )}
              {currentFilter === 'completed' && (
                <button
                  onClick={() => setIsDeleteCompletedDialogOpen(true)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Delete completed tasks
                </button>
              )}
            </div>
          )}

          <DeleteConfirmDialog
            isOpen={isDeleteCompletedDialogOpen}
            onClose={() => setIsDeleteCompletedDialogOpen(false)}
            onConfirm={deleteDoneTasks}
            type="completed"
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/overdue" element={<AppContent />} />
        <Route path="/today" element={<AppContent />} />
        <Route path="/tomorrow" element={<AppContent />} />
        <Route path="/upcoming" element={<AppContent />} />
        <Route path="/completed" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;