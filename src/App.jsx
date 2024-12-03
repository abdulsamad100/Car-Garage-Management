import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import SignupForm from './Routes/SignupForm';
import Home from './Routes/Home';
import About from './Routes/About';
import Contact from './Routes/Contact';
import NotFound from './Routes/NotFound';
import LoginForm from './Routes/LoginForm';
import Dashboard from './Routes/Dashboard';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import Routechecker from './Routes/Routechecker';
import AnotherChecker from './Routes/AnotherChecker';
import CustomThemeProvider from './context/ThemeContext';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route element={<AnotherChecker />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<Routechecker />}>
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
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
