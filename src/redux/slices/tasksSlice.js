import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper functions for localStorage
const saveTasksToLocalStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks to localStorage:', err);
  }
};

const loadTasksFromLocalStorage = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (err) {
    console.error('Error loading tasks from localStorage:', err);
    return [];
  }
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  console.log('Fetching tasks from localStorage...');
  const tasks = loadTasksFromLocalStorage();
  console.log('Fetched tasks:', tasks);
  return tasks;
});

export const createTask = createAsyncThunk('tasks/createTask', async (task, { rejectWithValue }) => {
  try {
    console.log('Creating task:', task);
    const newTask = { ...task, id: Math.random().toString() };
    // Update localStorage
    const existingTasks = loadTasksFromLocalStorage();
    const updatedTasks = [...existingTasks, newTask];
    saveTasksToLocalStorage(updatedTasks);
    console.log('Task created:', newTask);
    return newTask;
  } catch (err) {
    console.error('Error creating task:', err);
    return rejectWithValue(err.message || 'Failed to create task');
  }
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const task = state.tasks.tasks.find((t) => t.id === id);
      if (!task) {
        return rejectWithValue('Task not found');
      }
      // Validate status transition based on history
      const lastStatus = task.statusHistory[task.statusHistory.length - 1]?.status;
      if (status === 'finished' && lastStatus !== 'active') {
        return rejectWithValue('Task must be active before marking as finished');
      }
      console.log('Updating task status:', { id, status });
      const updatedTask = { id, status, statusHistory: [...task.statusHistory, { status, timestamp: new Date().toISOString() }] };
      // Update localStorage
      const existingTasks = loadTasksFromLocalStorage();
      const updatedTasks = existingTasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t));
      saveTasksToLocalStorage(updatedTasks);
      return updatedTask;
    } catch (err) {
      console.error('Error updating task status:', err);
      return rejectWithValue(err.message || 'Failed to update task status');
    }
  }
);

export const removeTask = createAsyncThunk('tasks/removeTask', async (id, { rejectWithValue }) => {
  try {
    console.log('Removing task:', id);
    // Update localStorage
    const existingTasks = loadTasksFromLocalStorage();
    const updatedTasks = existingTasks.filter((t) => t.id !== id);
    saveTasksToLocalStorage(updatedTasks);
    return id;
  } catch (err) {
    console.error('Error removing task:', err);
    return rejectWithValue(err.message || 'Failed to delete task');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        console.log('Task added to store:', action.payload);
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create task';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { id, status, statusHistory } = action.payload;
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.status = status;
          task.statusHistory = statusHistory;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update task status';
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

export default tasksSlice.reducer;