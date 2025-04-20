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
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true); 

  
    if (!name || !description || !deadline || !status) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }


    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Deadline cannot be in the past');
      setIsSubmitting(false);
      return;
    }

   
    try {
      await dispatch(
        createTask({
          name,
          description,
          status,
          deadline: selectedDate.toISOString(),
          statusHistory: [{ status, timestamp: new Date().toISOString() }],
        })
      ).unwrap();

      
      setSuccessMessage('Task added successfully!');
      setName('');
      setDescription('');
      setDeadline('');
      setStatus('pending');
      
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500); 

    } catch (err) {
      setError(err.message || 'Failed to add task');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="card">
      <h2>Add New Task</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task-name">Task Name</label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter task name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter task description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-deadline">Deadline</label>
          <input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;

