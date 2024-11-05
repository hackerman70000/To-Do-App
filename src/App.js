import React, { useCallback, useEffect, useState } from 'react';
import { DeleteConfirmDialog } from './components/common/DeleteConfirmDialog';
import TaskForm from './components/task/TaskForm';
import TaskList from './components/task/TaskList';
import { initialTasks } from './data/initialTasks';

const CURRENT_VERSION = '1.0';

function App() {
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
      
      if (!storedVersion || 
          storedVersion !== CURRENT_VERSION || 
          !savedTasks) {
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
    }, 60000); // Check every minute
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
      priority: 'medium',
      tags: [],
      recurrence: 'none'
    });
  }, [newTask, evaluateTaskStatuses]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your tasks</h1>
        
        <TaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
        />
        
        <TaskList
          tasks={tasks}
          toggleTaskStatus={toggleTaskStatus}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />
        
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={resetToInitialTasks}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset to Default Tasks
          </button>
          <button
            onClick={() => setIsDeleteCompletedDialogOpen(true)}
            className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            Delete completed tasks
          </button>
        </div>

        <DeleteConfirmDialog
          isOpen={isDeleteCompletedDialogOpen}
          onClose={() => setIsDeleteCompletedDialogOpen(false)}
          onConfirm={deleteDoneTasks}
          type="completed"
        />
      </div>
    </div>
  );
}

export default App;