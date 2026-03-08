import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import PassManagement from './pages/PassManagement';
import Residents from './pages/Residents';
import Votes from './pages/Votes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/passes" element={<PassManagement />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/votes" element={<Votes />} />
        <Route path="/dashboard" element={<div className="p-8 text-center text-2xl">მთავარი გვერდი (Dashboard)</div>} />
      </Routes>
    </BrowserRouter>
  );
}
