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
    const deadlineDate = new Date(task.deadline);
    const currentDate = new Date();
    const timeDiff = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  };

  return (
    <div className="task-card">
      <div>
        <h3><i className="fas fa-task"></i> {task.name}</h3>
        <p><i className="fas fa-align-left"></i> {task.description}</p>
        <p><i className="fas fa-calendar"></i> Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
        <p><i className="fas fa-clock"></i> Days Left: {calculateDaysLeft()}</p>
      </div>
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