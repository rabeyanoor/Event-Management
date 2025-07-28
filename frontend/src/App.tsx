import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Header } from "./components/Layout/Header";
import { LoginForm } from "./components/Auth/LoginForm";
import { RegisterForm } from "./components/Auth/RegisterForm";
import Dashboard from "./components/Dashboard/Dashboard";
import { EventList } from "./components/Events/EventList";
import { EventDetails } from "./components/Events/EventDetails";
import { CreateEvent } from "./components/Events/CreateEvent";
import { EditEvent } from "./components/Events/EditEvent";
import { EventCalendar } from "./components/Calendar/EventCalendar";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
  const navigate = useNavigate();
  const handleEventListNavigate = (page: string, eventId?: string) => {
    if (page === "event-details" && eventId) {
      navigate(`/events/${eventId}`);
    }
    if (page === "events") {
      navigate(`/events`);
    }
    // Add more navigation logic if needed
  };
  return (
    <>
      <Header />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventList onNavigate={handleEventListNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId"
            element={
              <ProtectedRoute>
                <EventDetailsWithParams onNavigate={handleEventListNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/edit"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <EventCalendar onNavigate={handleEventListNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}

function EventDetailsWithParams(props: any) {
  const { eventId } = useParams();
  return <EventDetails eventId={eventId!} {...props} />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
