import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}
