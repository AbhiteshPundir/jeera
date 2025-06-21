import { useAuth } from '../context/auth.context';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">🧠 Task Manager</h2>
        <nav className="flex flex-col gap-3">
          <button onClick={() => navigate('/')} className="text-left hover:text-blue-400">Dashboard</button>
          <button onClick={() => navigate('/projects')} className="text-left hover:text-blue-400">Projects</button>
          <button onClick={() => navigate('/tasks')} className="text-left hover:text-blue-400">My Tasks</button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome, {user?.name.split(' ')[0]} 👋</h1>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
            Logout
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
