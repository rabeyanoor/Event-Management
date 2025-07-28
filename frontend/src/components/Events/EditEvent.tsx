import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  FileText,
  Tag,
  ArrowLeft,
  Save,
  Loader,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { eventService } from "../../services/eventService";
import { Event, EventCategory, LocationType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import toast from "react-hot-toast";

export const EditEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "CONFERENCE" as EventCategory,
    startDateTime: "",
    endDateTime: "",
    locationType: "PHYSICAL" as LocationType,
    address: "",
    city: "",
    country: "",
    virtualLink: "",
    capacity: 50,
    registrationDeadline: "",
    requirements: "",
    agenda: "",
    tags: "",
    imageUrl: "",
  });

  const categories: EventCategory[] = [
    "CONFERENCE",
    "WORKSHOP",
    "WEBINAR",
    "SOCIAL",
    "SPORTS",
  ];

  // Add loadEvent to useCallback to prevent unnecessary re-renders
  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(eventId!);
      setEvent(eventData);

      // Populate form with existing data
      setFormData({
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        startDateTime: new Date(eventData.startDateTime).toISOString().slice(0, 16),
        endDateTime: new Date(eventData.endDateTime).toISOString().slice(0, 16),
        locationType: eventData.location.type,
        address: eventData.location.address || "",
        city: eventData.location.city || "",
        country: eventData.location.country || "",
        virtualLink: eventData.location.virtualLink || "",
        capacity: eventData.capacity,
        registrationDeadline: new Date(eventData.registrationDeadline).toISOString().slice(0, 16),
        requirements: eventData.requirements || "",
        agenda: eventData.agenda || "",
        tags: eventData.tags.join(", "),
        imageUrl: eventData.imageUrl || "",
      });
    } catch {
      toast.error("Failed to load event details");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  }, [eventId, navigate]);

  useEffect(() => {
    if (!eventId) {
      navigate("/events");
      return;
    }
    loadEvent();
  }, [eventId, navigate, loadEvent]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !eventId) return;

    // Validation
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Event description is required");
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);
    const regDeadline = new Date(formData.registrationDeadline);

    if (isNaN(startDate.getTime())) {
      toast.error("Please enter a valid start date and time");
      return;
    }

    if (isNaN(endDate.getTime())) {
      toast.error("Please enter a valid end date and time");
      return;
    }

    if (isNaN(regDeadline.getTime())) {
      toast.error("Please enter a valid registration deadline");
      return;
    }

    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (regDeadline >= startDate) {
      toast.error("Registration deadline must be before event start date");
      return;
    }

    if (formData.capacity < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }

    if (formData.locationType === "PHYSICAL" && (!formData.city.trim() || !formData.country.trim())) {
      toast.error("City and country are required for physical events");
      return;
    }

    if (formData.locationType === "ONLINE" && !formData.virtualLink.trim()) {
      toast.error("Virtual link is required for online events");
      return;
    }

    try {
      setSaving(true);

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        locationType: formData.locationType,
        address: formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID" 
          ? formData.address.trim() 
          : undefined,
        city: formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID" 
          ? formData.city.trim() 
          : undefined,
        country: formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID" 
          ? formData.country.trim() 
          : undefined,
        virtualLink: formData.locationType === "ONLINE" || formData.locationType === "HYBRID" 
          ? formData.virtualLink.trim() 
          : undefined,
        capacity: formData.capacity,
        registrationDeadline: regDeadline.toISOString(),
        requirements: formData.requirements.trim() || undefined,
        agenda: formData.agenda.trim() || undefined,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      console.log("Sending event data:", eventData);
      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      console.log("Event updated successfully:", updatedEvent);
      toast.success("Event updated successfully!");
      
      // Small delay to ensure database changes are reflected
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 500);
    } catch (error: any) {
      console.error("Failed to update event:", error);
      
      // Try to extract backend error message
      let errorMessage = "Failed to update event. Please try again.";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message && error.message !== "Failed to update event") {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The event you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can edit this event
  const canEdit = user && (
    user.role === "ADMIN" || 
    user.role === "ORGANIZER" || 
    event.organizerId === user.id
  );

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to edit this event.
          </p>
          <Button onClick={() => navigate("/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/events/${eventId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Edit Event</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                Update your event details
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="animate-slideUp">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Describe your event"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capacity *
                  </label>
                  <Input
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., technology, networking, innovation"
                  icon={<Tag className="h-5 w-5" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Image URL
                </label>
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="animate-slideUp" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Date & Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date & Time *
                  </label>
                  <Input
                    name="startDateTime"
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date & Time *
                  </label>
                  <Input
                    name="endDateTime"
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration Deadline *
                </label>
                <Input
                  name="registrationDeadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="animate-slideUp" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location Type *
                </label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                >
                  <option value="PHYSICAL">Physical Location</option>
                  <option value="ONLINE">Online Event</option>
                  <option value="HYBRID">Hybrid Event</option>
                </select>
              </div>

              {(formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required={formData.locationType === "PHYSICAL"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country *
                      </label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                        required={formData.locationType === "PHYSICAL"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {(formData.locationType === "ONLINE" || formData.locationType === "HYBRID") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Virtual Meeting Link *
                  </label>
                  <Input
                    name="virtualLink"
                    value={formData.virtualLink}
                    onChange={handleInputChange}
                    placeholder="https://zoom.us/meeting/..."
                    required={formData.locationType === "ONLINE"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="animate-slideUp" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span>Additional Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Any requirements for attendees (e.g., laptop, prior knowledge)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agenda
                </label>
                <textarea
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Event schedule and agenda"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 animate-slideUp" style={{ animationDelay: '400ms' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/events/${eventId}`)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="shadow-glow"
            >
              {saving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};