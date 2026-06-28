import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '../components/common/loading/Loading';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Auth from '../components/auth/Auth';

const HomePage = lazy(() => import('../pages/home/HomePage'));
const FeedPage = lazy(() => import('../pages/feed/FeedPage'));
const MyNotesPage = lazy(() => import('../pages/mynotes/MyNotesPage'));
const NotFoundPage = lazy(() => import('../pages/notFound/NotFoundPage'));

/**
 * Platform application routes management.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Auth />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/mynotes" element={<MyNotesPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
