import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/slices/tasksSlice';
import { Link } from 'react-router-dom';
import TaskList from '../components/Tasks/TaskList.jsx';
import TaskFilter from '../components/Tasks/TaskFilter.jsx';
import Logout from '../components/Auth/Logout.jsx';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { status, error, tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    console.log('Fetching tasks on dashboard mount');
    dispatch(fetchTasks());
  }, [dispatch]);

  console.log('Current tasks in store:', tasks);

  return (
    <div className="dashboard">
      <div className="profile-corner">
        <Link to="/profile" title="Profile">
          <img
            src={user?.image || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="profile-image-corner"
          />
          <span className="profile-username">{user?.username || 'User'}</span>
        </Link>
      </div>
      <div className="actions">
        <h2>Task Dashboard</h2>
        <div className="actions">
          <Link to="/add-task" className="success">
            <i className="fas fa-plus"></i> Add New Task
          </Link>
          <Logout />
        </div>
      </div>
      <TaskFilter onFilterChange={setFilter} />
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && <TaskList filter={filter} />}
    </div>
  );
};

export default Dashboard;