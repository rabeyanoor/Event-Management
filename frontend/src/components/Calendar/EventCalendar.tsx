import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Sparkles,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { eventService } from "../../services/eventService";
import { Event } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";

interface EventCalendarProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const allEvents = await eventService.getEvents();
    const publishedEvents = allEvents.filter(
      (event) => event.status === "PUBLISHED"
    );
    setEvents(publishedEvents);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Adjust to start from Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Adjust to end on Saturday
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
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

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CONFERENCE":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "WORKSHOP":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
      case "WEBINAR":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      case "SOCIAL":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "SPORTS":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slideUp">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Event Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                Visualize your events in beautiful calendar format ✨
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <Card
          className="mb-6 glass-effect animate-slideUp"
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatMonthYear(currentDate)}
                </h2>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "month" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="flex items-center space-x-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Month</span>
                </Button>

                <Button
                  variant={viewMode === "week" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="flex items-center space-x-2"
                >
                  <List className="h-4 w-4" />
                  <span>List</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          {viewMode === "month" ? (
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden p-1">
                {/* Week days header */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 dark:bg-gray-700 p-3 text-center rounded-lg"
                  >
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {day}
                    </span>
                  </div>
                ))}

                {/* Calendar days */}
                {days.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={index}
                      className={`bg-white dark:bg-gray-800 min-h-[120px] p-2 rounded-lg transition-all duration-300 hover:shadow-md ${
                        !isCurrentMonthDay ? "opacity-50" : ""
                      } ${
                        dayEvents.length > 0
                          ? "ring-1 ring-blue-200 dark:ring-blue-800"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-2 transition-all duration-200 ${
                          isTodayDate
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow"
                            : "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        {date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={event.id}
                            onClick={() =>
                              onNavigate("event-details", event.id)
                            }
                            className={`p-1.5 rounded-md text-xs cursor-pointer hover:scale-105 transition-all duration-200 border shadow-sm ${getCategoryColor(
                              event.category
                            )} animate-fadeIn`}
                            style={{ animationDelay: `${eventIndex * 100}ms` }}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                            <div className="truncate opacity-75">
                              <Clock className="inline h-3 w-3 mr-1" />
                              {formatTime(event.startDateTime)}
                            </div>
                          </div>
                        ))}

                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-center animate-fadeIn">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          ) : (
            <CardContent>
              {/* List View */}
              <div className="space-y-4">
                {events
                  .filter((event) => {
                    const eventDate = new Date(event.startDateTime);
                    return (
                      eventDate.getMonth() === currentDate.getMonth() &&
                      eventDate.getFullYear() === currentDate.getFullYear()
                    );
                  })
                  .sort(
                    (a, b) =>
                      new Date(a.startDateTime).getTime() -
                      new Date(b.startDateTime).getTime()
                  )
                  .map((event, index) => (
                    <div
                      key={event.id}
                      onClick={() => onNavigate("event-details", event.id)}
                      className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {event.title}
                            </h3>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                                event.category
                              )}`}
                            >
                              {event.category}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4 text-blue-500" />
                              <span>
                                {formatDate(new Date(event.startDateTime))}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span>{formatTime(event.startDateTime)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-purple-500" />
                              <span>
                                {event.location.type === "ONLINE"
                                  ? "Online"
                                  : `${event.location.city}, ${event.location.country}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {events.filter((event) => {
                  const eventDate = new Date(event.startDateTime);
                  return (
                    eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear()
                  );
                }).length === 0 && (
                  <div className="text-center py-16 animate-fadeIn">
                    <div className="relative mb-6">
                      <CalendarIcon className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      No events this month
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Check other months or browse all events to discover
                      amazing experiences
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Legend */}
        <Card className="animate-slideUp" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Event Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["CONFERENCE", "WORKSHOP", "WEBINAR", "SOCIAL", "SPORTS"].map(
                (category, index) => (
                  <div
                    key={category}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 animate-fadeIn"
                    style={{ animationDelay: `${(index + 5) * 100}ms` }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${getCategoryColor(
                        category
                      )}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.charAt(0) + category.slice(1).toLowerCase()}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
