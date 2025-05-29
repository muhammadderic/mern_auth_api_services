import type { ReactNode } from "react";
import { useAuthStore } from "./store/authStore";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

type JSXReturnRouteProps = {
  children: ReactNode;
}

// Protect routes that require authentication
const ProtectedRoute = ({ children }: JSXReturnRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
