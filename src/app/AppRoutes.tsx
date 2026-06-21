// src/app/AppRoutes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/common/loading/Loading';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Auth from '../components/auth/Auth';

// Lazy loading your components
const HomePage = lazy(() => import('../pages/home/HomeRoutes'));
const NotFoundPage = lazy(() => import('../pages/notFound/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Auth />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home/*" element={<HomePage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
