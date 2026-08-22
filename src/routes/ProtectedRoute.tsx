import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth"; // Your custom auth hook
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();


  if (isLoading) {
    return (
        <main className="loading">
            <LoadingSpinner />
        </main>
    );
  }

 
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;