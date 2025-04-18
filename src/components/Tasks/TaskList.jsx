import { useSelector } from 'react-redux';
import TaskItem from './TaskItem.jsx';

const TaskList = ({ filter }) => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const filteredTasks = filter
    ? tasks.filter((task) => task.status === filter)
    : tasks;

  console.log('Filtered tasks:', filteredTasks);

  return (
    <div className="task-list">
      {filteredTasks.length ? (
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default TaskList;