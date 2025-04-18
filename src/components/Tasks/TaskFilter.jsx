const TaskFilter = ({ onFilterChange }) => {
  return (
    <div className="actions">
      <button onClick={() => onFilterChange('')} className="filter">
        <i className="fas fa-list"></i> All
      </button>
      <button onClick={() => onFilterChange('pending')} className="filter">
        <i className="fas fa-hourglass-start"></i> Pending
      </button>
      <button onClick={() => onFilterChange('active')} className="filter">
        <i className="fas fa-play"></i> Active
      </button>
      <button onClick={() => onFilterChange('finished')} className="filter">
        <i className="fas fa-check"></i> Finished
      </button>
    </div>
  );
};

export default TaskFilter;