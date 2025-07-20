import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

const Loader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 