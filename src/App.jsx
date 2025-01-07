import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import SignupForm from "./Routes/SignupForm";
import NotFound from "./Routes/NotFound";
import LoginForm from "./Routes/LoginForm";
import Dashboard from "./Routes/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Routechecker from "./Routes/Routechecker";
import AnotherChecker from "./Routes/AnotherChecker";
import CustomThemeProvider from "./context/ThemeContext";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import MyAppointments from "./components/MyAppointments";
import ConfirmedAppointments from "./components/ConfirmedAppointments";
import History from "./components/History";
import AdminHistory from "./components/AdminHistory";

const PrivateRoute = ({ children, isAdminRoute = false }) => {
  const { signin, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;

  if (!signin.userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminRoute && !signin.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!isAdminRoute && signin.isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

const RedirectDashboard = ({ children }) => {
  const { signin, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;

  if (signin.isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route
        element={
          <RedirectDashboard>
            <AnotherChecker />
          </RedirectDashboard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<Routechecker />}>
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>

      {/* Regular User Private Routes */}
      <Route
        element={
          <PrivateRoute>
            <AnotherChecker />
          </PrivateRoute>
        }
      >
        <Route path="/myappointments" element={<MyAppointments />} />
        <Route path="/history" element={<History />} />
      </Route>

      {/* Admin Private Routes */}
      <Route
        element={
          <PrivateRoute isAdminRoute>
            <AnotherChecker />
          </PrivateRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-history" element={<AdminHistory />} />
      </Route>

      <Route path="/confirmedappointments" element={<ConfirmedAppointments />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <RouterProvider router={router} />
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App;
