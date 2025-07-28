import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, MapPin, Users, Clock, Sparkles, Star, ChevronDown, Edit, Trash2, MoreVertical } from "lucide-react";
import { eventService } from "../../services/eventService";
import { registrationService } from "../../services/registrationService";
import { useAuth } from "../../contexts/AuthContext";
import type { Event, EventCategory, Registration } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import toast from "react-hot-toast";

interface EventListProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export const EventList: React.FC<EventListProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(
    Boolean(location.state && location.state.eventCreated)
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "">(
    ""
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>(
    []
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories: EventCategory[] = [
    "CONFERENCE",
    "WORKSHOP",
    "WEBINAR",
    "SOCIAL",
    "SPORTS",
  ];

  useEffect(() => {
    loadEvents();
    // Fetch user registrations
    const fetchUserRegistrations = async () => {
      try {
        if (user) {
          const regs = await registrationService.getUserRegistrations(user.id);
          setUserRegistrations(Array.isArray(regs) ? regs : []);
        } else {
          setUserRegistrations([]);
        }
      } catch {
        setUserRegistrations([]);
      }
    };
    fetchUserRegistrations();
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const loadEvents = async () => {
    const allEvents = await eventService.getEvents();
    const publishedEvents = allEvents.filter(
      (event: Event) => event.status === "PUBLISHED"
    );
    setEvents(publishedEvents);
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = eventService.searchEvents(
        searchQuery,
        selectedCategory || undefined
      );
    } else if (selectedCategory) {
      filtered = events.filter(
        (event: Event) => event.category === selectedCategory
      );
    }

    setFilteredEvents(filtered);
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
    if (!user) return null;
    if (!Array.isArray(userRegistrations)) return null;
    const registration = userRegistrations.find(
      (reg) => reg.eventId === eventId
    );
    return registration?.status || null;
  };

  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case "CONFERENCE":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "WORKSHOP":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300";
      case "WEBINAR":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      case "SOCIAL":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "SPORTS":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "WAITLISTED":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "CANCELLED":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const handleEditEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/${eventId}/edit`);
    setOpenDropdown(null);
  };

  const handleDeleteEvent = async (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(null);

    const confirmMessage = `Are you sure you want to delete "${event.title}"? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      await eventService.deleteEvent(event.id);
      console.log("Event deleted successfully:", event.id);
      toast.success("Event deleted successfully");
      
      // Small delay to ensure database changes are reflected
      setTimeout(() => {
        loadEvents(); // Refresh the events list
      }, 500);
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const canEditEvent = (event: Event) => {
    return user && (
      user.role === "ADMIN" || 
      user.role === "ORGANIZER" || 
      event.organizerId === user.id
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center justify-between shadow-lg">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                <span className="font-medium">Event created successfully!</span>
              </div>
              <button
                className="ml-4 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-200"
                onClick={() => setShowSuccess(false)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 animate-slideUp">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Discover Events</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                Find and register for amazing events happening around you ✨
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 animate-slideUp glass-effect" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <Input
                  placeholder="Search events by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-5 w-5" />}
                  className="shadow-sm"
                />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 animate-slideDown">
                    <div className="p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) =>
                          setSelectedCategory(
                            e.target.value as EventCategory | ""
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0) + category.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      
                      {(searchQuery || selectedCategory) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("");
                            setIsFilterOpen(false);
                          }}
                          className="w-full mt-3 text-gray-600 dark:text-gray-400"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
            filteredEvents.map((event: Event, index: number) => {
              if (!event || !event.location) {
                return (
                  <Card key={event?.id || Math.random()} className="p-6">
                    <span className="text-red-500 dark:text-red-400">Invalid event data</span>
                  </Card>
                );
              }
              const registrationStatus = getRegistrationStatus(event.id);
              const isUpcoming = new Date(event.startDateTime) > new Date();

              return (
                <Card
                  key={event.id}
                  hover
                  padding="none"
                  className="group overflow-hidden cursor-pointer animate-fadeIn hover:shadow-glow transition-all duration-300 relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => onNavigate("event-details", event.id)}
                >
                  {/* Event Image */}
                  <div className="relative overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    {registrationStatus && (
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${getStatusColor(registrationStatus)}`}>
                          {registrationStatus}
                        </span>
                      </div>
                    )}
                    
                    {/* Availability Badge */}
                    {isUpcoming && (
                      <div className="absolute top-3 left-3">
                        {event.registeredCount >= event.capacity ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 backdrop-blur-sm">
                            Full
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 backdrop-blur-sm">
                            Available
                          </span>
                        )}
                      </div>
                    )}

                    {/* Edit/Delete Dropdown */}
                    {canEditEvent(event) && (
                      <div className="absolute top-3 right-3">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === event.id ? null : event.id);
                            }}
                            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </button>

                          {openDropdown === event.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 animate-slideDown">
                              <div className="py-1">
                                <button
                                  onClick={(e) => handleEditEvent(event.id, e)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Event
                                </button>
                                <button
                                  onClick={(e) => handleDeleteEvent(event, e)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Event
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Category and Title */}
                    <div className="mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>
                        {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{formatDate(event.startDateTime)}</span>
                        <Clock className="h-4 w-4 ml-2 text-green-500" />
                        <span>{formatTime(event.startDateTime)}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="truncate">
                          {event.location.type === "ONLINE"
                            ? "Online Event"
                            : `${event.location.city}, ${event.location.country}`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span>
                          {event.registeredCount || 0} / {event.capacity} registered
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 ml-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 flex-wrap">
                        {event.tags &&
                          event.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        {event.tags && event.tags.length > 2 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            +{event.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16 col-span-full animate-fadeIn">
              <div className="relative mb-6">
                <Calendar className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search criteria or filters to discover more events"
                  : "There are no published events at the moment. Check back soon for exciting new events!"}
              </p>
              {(searchQuery || selectedCategory) && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  className="shadow-glow"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
