import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import { fetchTasks } from '../../redux/slices/tasksSlice';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../Tasks/TaskItem.jsx';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || '');
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) {
      console.log('Fetching tasks for user:', user.userId);
      dispatch(fetchTasks());
    }
  }, [dispatch, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setFormError('Please upload a JPEG or PNG image');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Image size must be less than 2MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !username) {
      setFormError('Email and username are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Invalid email format');
      return;
    }
    try {
      const updatedProfile = { email, username };
      if (image) {
        updatedProfile.image = imagePreview;
      }
      dispatch(updateProfile(updatedProfile));
      console.log('Profile updated:', updatedProfile);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
      console.error('Profile update failed:', err);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const userTasks = tasks.filter((task) => task.userId === user.userId);

  return (
    <div className="card">
      <h2>Your Profile</h2>
      {formError && <p className="error">{formError}</p>}
      <div className="profile-image">
        <img
          src={imagePreview || 'https://via.placeholder.com/100'}
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }}
        />
        <div className="form-group">
          <label><i className="fas fa-image"></i> Profile Picture</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><i className="fas fa-envelope"></i> Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label><i className="fas fa-user"></i> Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary">
          <i className="fas fa-save"></i> Save Changes
        </button>
      </form>
      <h3>Your Tasks</h3>
      {status === 'loading' && <p>Loading tasks...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <div className="task-list">
          {userTasks.length ? (
            userTasks.map((task) => <TaskItem key={task.id} task={task} />)
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;