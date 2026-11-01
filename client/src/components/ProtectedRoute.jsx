import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-shell text-center py-5"><div className="spinner-border text-success" role="status" /></div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
