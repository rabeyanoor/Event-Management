import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { eventService } from "../../services/eventService";
import { registrationService } from "../../services/registrationService";
import { Event, Registration } from "../../types";

interface AttendeeDashboardProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export const AttendeeDashboard: React.FC<AttendeeDashboardProps> = ({
  onNavigate,
}) => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const userRegistrations = await registrationService.getUserRegistrations(
      user!.id
    );
    const allEvents = eventService.getEvents();

    const registeredEvents = userRegistrations
      .filter((reg) => reg.status === "CONFIRMED")
      .map((reg) => allEvents.find((event) => event.id === reg.eventId))
      .filter(Boolean) as Event[];

    const now = new Date();
    const upcoming = allEvents
      .filter(
        (event) =>
          new Date(event.startDateTime) > now &&
          event.status === "PUBLISHED" &&
          !userRegistrations.some((reg) => reg.eventId === event.id)
      )
      .slice(0, 6);

    setRegistrations(userRegistrations);
    setEvents(registeredEvents);
    setUpcomingEvents(upcoming);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRegistrationStatus = (eventId: string) => {
    const registration = registrations.find((reg) => reg.eventId === eventId);
    return registration?.status || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "WAITLISTED":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Discover amazing events and manage your registrations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Registered Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    events.filter(
                      (event) => new Date(event.startDateTime) > new Date()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Attended Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter((reg) => reg.attended).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                My Registered Events
              </h2>
            </div>
            <div className="p-6">
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 4).map((event) => {
                    const status = getRegistrationStatus(event.id);
                    return (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => onNavigate("event-details", event.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {event.title}
                          </h3>
                          {status && (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.startDateTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.startDateTime)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {events.length > 4 && (
                    <button
                      onClick={() => onNavigate("events")}
                      className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
                    >
                      View all registered events
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No registered events
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Explore and register for exciting events
                  </p>
                  <button
                    onClick={() => onNavigate("events")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Browse Events
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Discover Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Discover New Events
              </h2>
            </div>
            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => onNavigate("event-details", event.id)}
                    >
                      <h3 className="font-semibold text-gray-900 text-sm mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.startDateTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{event.capacity} seats</span>
                          </div>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => onNavigate("events")}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
                  >
                    View all events
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new events
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
