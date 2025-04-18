import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../redux/slices/tasksSlice';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !description || !deadline || !status) {
      setError('All fields are required');
      return;
    }
    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Deadline cannot be in the past');
      return;
    }
    try {
      console.log('Submitting task:', { name, description, status, deadline });
      const result = await dispatch(
        createTask({
          name,
          description,
          status,
          deadline: selectedDate.toISOString(),
          statusHistory: [{ status, timestamp: new Date().toISOString() }],
        })
      ).unwrap();
      console.log('Task created successfully:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('Task creation failed:', err);
      setError(err.message || 'Failed to add task');
    }
  };

  return (
    <div className="card">
      <h2>Add New Task</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <button type="submit" className="primary">
          <i className="fas fa-plus"></i> Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;