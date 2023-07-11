import logo from './logo.svg';
import './App.css';
import Index from './Components';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Components/login';
import User from './Components/userpage';

const isAuthenticated = () => {
  return !!sessionStorage.getItem('username');
};

const ProtectedRoute = ({ element: Element, ...props }) => {
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    alert("You should login...!");
    return <Navigate to="/" replace />;
    
  }

  return <Element {...props} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/adduser" element={<Index />} />
        <Route
          path="/userpage"
          element={<ProtectedRoute element={User} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
