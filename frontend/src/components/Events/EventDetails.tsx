import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { eventService } from "../../services/eventService";
import { registrationService } from "../../services/registrationService";
import { Event, Registration } from "../../types";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface EventDetailsProps {
  eventId: string;
  onNavigate: (page: string, eventId?: string) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  eventId,
  onNavigate,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId, user]);

  const loadEventDetails = async () => {
    const eventData = await eventService.getEventById(eventId);
    setEvent(eventData);

    if (eventData && user) {
      const userRegistrations = await registrationService.getUserRegistrations(
        user.id
      );
      const eventRegistration = userRegistrations.find(
        (reg: Registration) => reg.eventId === eventId
      );
      setRegistration(eventRegistration || null);

      const allRegistrations = await registrationService.getEventRegistrations(
        eventId
      );
      const confirmedCount = allRegistrations.filter(
        (reg: Registration) => reg.status === "CONFIRMED"
      ).length;
      setRegistrationCount(confirmedCount);
    }
  };

  const handleRegister = async () => {
    if (!user || !event) return;

    setIsRegistering(true);
    try {
      const newRegistration: Registration =
        await registrationService.registerForEvent(event.id);
      if (newRegistration) {
        setRegistration(newRegistration);
        loadEventDetails(); // Refresh data
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!registration) return;

    if (window.confirm("Are you sure you want to cancel your registration?")) {
      await registrationService.cancelRegistration(registration.id);
      setRegistration(null);
      loadEventDetails(); // Refresh data
    }
  };

  const handleEditEvent = () => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleDeleteEvent = async () => {
    if (!event || !user) return;

    const confirmMessage = `Are you sure you want to delete "${event.title}"? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      await eventService.deleteEvent(eventId);
      console.log("Event deleted successfully:", eventId);
      toast.success("Event deleted successfully");
      
      // Small delay to ensure database changes are reflected
      setTimeout(() => {
        navigate("/events");
      }, 500);
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRegistrationStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "WAITLISTED":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "WAITLISTED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CONFERENCE":
        return "bg-blue-100 text-blue-800";
      case "WORKSHOP":
        return "bg-emerald-100 text-emerald-800";
      case "WEBINAR":
        return "bg-purple-100 text-purple-800";
      case "SOCIAL":
        return "bg-orange-100 text-orange-800";
      case "SPORTS":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => onNavigate("events")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isUpcoming = new Date(event.startDateTime) > new Date();
  const canRegister =
    isUpcoming && event.status === "PUBLISHED" && !registration;
  const isFull = registrationCount >= event.capacity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 py-8 transition-colors duration-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onNavigate("events")}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </button>

            {/* Edit and Delete buttons for admins, organizers, and event owners */}
            {user && event && (
              user.role === "ADMIN" || 
              user.role === "ORGANIZER" || 
              event.organizerId === user.id
            ) && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditEvent}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteEvent}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Event Image */}
        {event.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-800/60"
              style={{ backdropFilter: "blur(2px)" }}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-8 transition-colors duration-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${getCategoryColor(
                    event.category
                  )} bg-opacity-80 hover:scale-105 transition-transform duration-200`}
                >
                  {event.category}
                </span>
                {registration && (
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 border rounded-full shadow-sm ${getStatusColor(
                      registration.status
                    )} bg-opacity-80 hover:scale-105 transition-transform duration-200`}
                  >
                    {getRegistrationStatusIcon(registration.status)}
                    <span className="text-sm font-medium">
                      {registration.status}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                {event.title}
              </h1>
              <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                {event.description}
              </p>

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex px-2 py-1 text-sm bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 rounded shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-8 transition-colors duration-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Event Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">
                      Date & Time
                    </p>
                    <p className="text-white">
                      {formatDate(event.startDateTime)} at{" "}
                      {formatTime(event.startDateTime)}
                    </p>
                    {event.endDateTime !== event.startDateTime && (
                      <p className="text-gray-600">
                        Ends: {formatDate(event.endDateTime)} at{" "}
                        {formatTime(event.endDateTime)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">
                      Location
                    </p>
                    {event.location.type === "ONLINE" ? (
                      <p className="text-white">Online Event</p>
                    ) : (
                      <div className="text-white">
                        {event.location.address && (
                          <p>{event.location.address}</p>
                        )}
                        <p>
                          {event.location.city}, {event.location.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-200">
                      Capacity
                    </p>
                    <p className="text-white">
                      {registrationCount} / {event.capacity} registered
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (registrationCount / event.capacity) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Registration Deadline
                    </p>
                    <p className="text-gray-600">
                      {formatDate(event.registrationDeadline)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Information */}
            {(event.requirements || event.agenda) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-8 transition-colors duration-700"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Additional Information
                </h2>

                {event.requirements && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Requirements
                    </h3>
                    <p className="text-gray-600">{event.requirements}</p>
                  </div>
                )}

                {event.agenda && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Agenda
                    </h3>
                    <p className="text-gray-600">{event.agenda}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Registration Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-6 transition-colors duration-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Registration
              </h3>

              {registration ? (
                <div className="space-y-4">
                  <div
                    className={`p-4 border rounded-lg ${getStatusColor(
                      registration.status
                    )}`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getRegistrationStatusIcon(registration.status)}
                      <span className="font-medium">
                        Registration {registration.status}
                      </span>
                    </div>
                    <p className="text-sm">
                      Registered on {formatDate(registration.registrationDate)}
                    </p>
                  </div>

                  {registration.status === "CONFIRMED" &&
                    event.location.type === "ONLINE" &&
                    event.location.virtualLink && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Virtual Event Link
                        </p>
                        <a
                          href={event.location.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm break-all"
                        >
                          {event.location.virtualLink}
                        </a>
                      </div>
                    )}

                  {registration.status !== "CANCELLED" && (
                    <button
                      onClick={handleCancelRegistration}
                      className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm"
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {canRegister ? (
                    <>
                      {isFull ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-900">
                            Event is Full
                          </p>
                          <p className="text-sm text-yellow-700">
                            You can join the waitlist
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-900">
                            Spots Available
                          </p>
                          <p className="text-sm text-green-700">
                            {event.capacity - registrationCount} seats remaining
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleRegister}
                        disabled={isRegistering || isFull}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isFull
                          ? "Event Full"
                          : isRegistering
                          ? "Registering..."
                          : "Register"}
                      </button>
                    </>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">
                        Registration Closed
                      </p>
                      <p className="text-sm text-gray-600">
                        {!isUpcoming
                          ? "This event has already started or ended"
                          : "Registration deadline has passed"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Organizer Info */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
                Event Organizer
              </h3>
              <div className="flex items-center space-x-3">
                <User className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Event Organizer
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    Verified organizer
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
