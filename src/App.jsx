import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
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

const RedirectDashboard = ({ children }) => {
  const { signin, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;

  if (signin.isAdmin) {
    return <AdminDashboard />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Routes for regular users */}
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

      {/* Routes that require login/signup */}
      <Route element={<Routechecker />}>
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>

      {/* These routes do not need the RedirectDashboard check */}
      <Route path="/confirmedappointments" element={<ConfirmedAppointments />} />
      <Route path="/myappointments" element={<MyAppointments />} />

      {/* Catch-all route */}
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
