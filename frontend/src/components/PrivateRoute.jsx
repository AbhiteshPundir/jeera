import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import Loader from './Loader';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;

  return user ? <Outlet/> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
