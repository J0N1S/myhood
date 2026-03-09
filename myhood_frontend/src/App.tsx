import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import PassManagement from './pages/PassManagement';
import Residents from './pages/Residents';
import Votes from './pages/Votes';
import Documents from './pages/Documents';
import Neighborhood from './pages/Neighborhood';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes — redirect to /login when token is missing or expired */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/passes" element={<PrivateRoute><PassManagement /></PrivateRoute>} />
        <Route path="/residents" element={<PrivateRoute><Residents /></PrivateRoute>} />
        <Route path="/votes" element={<PrivateRoute><Votes /></PrivateRoute>} />
        <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
        <Route path="/neighborhood" element={<PrivateRoute><Neighborhood /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><div className="p-8 text-center text-2xl">მთავარი გვერდი (Dashboard)</div></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
