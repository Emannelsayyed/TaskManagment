import { useDispatch } from 'react-redux';
import { updateTaskStatus, removeTask } from '../../redux/slices/tasksSlice';

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
  };

  const calculateDaysLeft = () => {
    if (!task.deadline) return null;
    const deadlineDate = new Date(task.deadline);
    if (isNaN(deadlineDate)) return null;

    const currentDate = new Date();
    const timeDiff = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  };

  const getBackgroundColor = () => {
    if (task.status === 'finished') return '#d4edda'; // green
    if (task.status === 'active') return '#ffe6f0'; // soft pink
    return '#ffffff'; // default
  };

  const taskStyle = {
    backgroundColor: getBackgroundColor(),
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div style={taskStyle}>
      {task.name && <h3>{task.name}</h3>}
      {task.description && <p>{task.description}</p>}

      {task.deadline && !isNaN(new Date(task.deadline)) && (
        <p>
          <i className="fas fa-calendar"></i> Deadline:{' '}
          {new Date(task.deadline).toLocaleDateString()}
        </p>
      )}

      {daysLeft && (
        <p>
          <i className="fas fa-clock"></i> Days Left: {daysLeft}
        </p>
      )}

      <div className="actions">
        <select value={task.status} onChange={handleStatusChange}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="finished">Finished</option>
        </select>
        <button className="danger" onClick={handleDelete}>
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
