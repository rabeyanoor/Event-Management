import React, { useState, useEffect } from "react";
import { Users, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { eventService } from "../../services/eventService";
import { registrationService } from "../../services/registrationService";
import { Event, Registration, DashboardStats } from "../../types";

interface AdminDashboardProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<
    Registration[]
  >([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const allEvents = eventService.getEvents();
    const allRegistrations = await registrationService.getRegistrations();

    const now = new Date();
    const upcomingEvents = allEvents.filter(
      (event) =>
        new Date(event.startDateTime) > now && event.status === "PUBLISHED"
    );
    const completedEvents = allEvents.filter(
      (event) =>
        new Date(event.endDateTime) < now || event.status === "COMPLETED"
    );

    setStats({
      totalEvents: allEvents.length,
      totalRegistrations: allRegistrations.length,
      upcomingEvents: upcomingEvents.length,
      completedEvents: completedEvents.length,
    });

    // Recent events (last 5)
    const sortedEvents = allEvents
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
    setRecentEvents(sortedEvents);

    // Recent registrations (last 5)
    const sortedRegistrations = allRegistrations
      .sort(
        (a, b) =>
          new Date(b.registrationDate).getTime() -
          new Date(a.registrationDate).getTime()
      )
      .slice(0, 5);
    setRecentRegistrations(sortedRegistrations);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            System overview and management tools.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEvents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRegistrations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcomingEvents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completed Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedEvents}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Events
              </h2>
            </div>
            <div className="p-6">
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => onNavigate("event-details", event.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {event.title}
                        </h3>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {event.category}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created: {formatDate(event.createdAt)}</span>
                        <span>Capacity: {event.capacity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No events found
                </div>
              )}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Registrations
              </h2>
            </div>
            <div className="p-6">
              {recentRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {recentRegistrations.map((registration) => {
                    const event = eventService.getEventById(
                      registration.eventId
                    );
                    return (
                      <div
                        key={registration.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {event?.title || "Unknown Event"}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              registration.status
                            )}`}
                          >
                            {registration.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            Registered:{" "}
                            {formatDate(registration.registrationDate)}
                          </span>
                          <span>User ID: {registration.userId}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No registrations found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onNavigate("events")}
                className="p-4 text-left border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Events</h3>
                <p className="text-sm text-gray-600">
                  View and manage all events
                </p>
              </button>

              <button
                onClick={() => onNavigate("calendar")}
                className="p-4 text-left border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <TrendingUp className="h-8 w-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900">View Calendar</h3>
                <p className="text-sm text-gray-600">
                  Calendar view of all events
                </p>
              </button>

              <button className="p-4 text-left border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <Users className="h-8 w-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">
                  Manage users and permissions
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
