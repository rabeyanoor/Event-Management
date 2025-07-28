import React, { useState } from "react";
import { ArrowLeft, Calendar, MapPin, Tag, Sparkles, Clock, Users, FileText, Image, Globe, Building } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { eventService } from "../../services/eventService";
import { EventCategory, LocationType } from "../../types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const now = new Date();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "CONFERENCE" as EventCategory,
    startDateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // default: now + 1 day
    endDateTime: new Date(now.getTime() + 25 * 60 * 60 * 1000), // default: start + 1 hour
    locationType: "PHYSICAL" as LocationType,
    address: "",
    city: "",
    country: "",
    virtualLink: "",
    capacity: 50,
    registrationDeadline: new Date(now.getTime() + 12 * 60 * 60 * 1000), // default: now + 12 hours
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
  const locationTypes: LocationType[] = ["PHYSICAL", "ONLINE", "HYBRID"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Extra frontend validation
    const start = formData.startDateTime;
    const end = formData.endDateTime || formData.startDateTime;
    const regDeadline = formData.registrationDeadline;

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!start || isNaN(start.getTime()) || start <= now) {
      toast.error("Start date/time must be a valid future date.");
      return;
    }
    if (!end || isNaN(end.getTime()) || end <= now) {
      toast.error("End date/time must be a valid future date.");
      return;
    }
    if (end < start) {
      toast.error("End date/time must be after start date/time.");
      return;
    }
    if (!regDeadline || isNaN(regDeadline.getTime()) || regDeadline <= now) {
      toast.error("Registration deadline must be a valid future date.");
      return;
    }
    if (regDeadline >= start) {
      toast.error("Registration deadline must be before start date/time.");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required.");
      return;
    }
    if (!formData.locationType) {
      toast.error("Location type is required.");
      return;
    }
    if (formData.capacity < 1) {
      toast.error("Capacity must be at least 1.");
      return;
    }
    if (
      (formData.locationType === "PHYSICAL" ||
        formData.locationType === "HYBRID") &&
      (!formData.city.trim() || !formData.country.trim())
    ) {
      toast.error("City and country are required for physical/hybrid events.");
      return;
    }
    if (
      (formData.locationType === "ONLINE" ||
        formData.locationType === "HYBRID") &&
      !formData.virtualLink.trim()
    ) {
      toast.error("Virtual link is required for online/hybrid events.");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDateTime: formData.startDateTime?.toISOString(),
        endDateTime: formData.endDateTime?.toISOString(),
        locationType: formData.locationType,
        address:
          formData.locationType === "PHYSICAL" ||
          formData.locationType === "HYBRID"
            ? formData.address
            : undefined,
        city:
          formData.locationType === "PHYSICAL" ||
          formData.locationType === "HYBRID"
            ? formData.city
            : undefined,
        country:
          formData.locationType === "PHYSICAL" ||
          formData.locationType === "HYBRID"
            ? formData.country
            : undefined,
        virtualLink:
          formData.locationType === "ONLINE" ||
          formData.locationType === "HYBRID"
            ? formData.virtualLink
            : undefined,
        capacity: formData.capacity,
        registrationDeadline: formData.registrationDeadline?.toISOString(),
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        imageUrl: formData.imageUrl || undefined,
        requirements: formData.requirements || undefined,
        agenda: formData.agenda || undefined,
      };

      await eventService.createEvent(eventData);
      toast.success("Event created successfully!");
      navigate("/events", { state: { eventCreated: true } }); // Redirect to events page with flag
    } catch (error: unknown) {
      // Try to extract backend error message
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response
      ) {
        (error.response as Response)
          .json()
          .then((data: Record<string, unknown>) => {
            const msg =
              data && typeof data.message === "string"
                ? data.message
                : typeof data.error === "string"
                ? data.error
                : JSON.stringify(data);
            toast.error(
              msg ||
                "Failed to create event. Please check your input and try again."
            );
          })
          .catch(() => {
            toast.error(
              "Failed to create event. Please check your input and try again."
            );
          });
      } else {
        toast.error(
          "Failed to create event. Please check your input and try again."
        );
      }
      console.error("Failed to create event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title &&
      formData.description &&
      formData.startDateTime &&
      formData.registrationDeadline &&
      formData.capacity > 0 &&
      ((formData.locationType === "PHYSICAL" &&
        formData.city &&
        formData.country) ||
        (formData.locationType === "ONLINE" && formData.virtualLink) ||
        (formData.locationType === "HYBRID" &&
          formData.city &&
          formData.country &&
          formData.virtualLink))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slideUp">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white animate-bounce-gentle" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Tag className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Create New Event</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                Bring your vision to life and create amazing experiences ✨
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="glass-effect animate-slideUp" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Event Title *"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    icon={<Sparkles className="h-5 w-5" />}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Describe your event in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Input
                    label="Capacity *"
                    type="number"
                    name="capacity"
                    value={formData.capacity.toString()}
                    onChange={handleInputChange}
                    placeholder="50"
                    icon={<Users className="h-5 w-5" />}
                    required
                    min="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Tags (comma separated)"
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., technology, networking, innovation"
                    icon={<Tag className="h-5 w-5" />}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Event Image URL"
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    icon={<Image className="h-5 w-5" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="glass-effect animate-slideUp" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Date & Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline h-4 w-4 mr-1 text-blue-500" />
                    Start Date & Time *
                  </label>
                  <DatePicker
                    selected={formData.startDateTime}
                    onChange={(date) => handleDateChange("startDateTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    minDate={new Date()}
                    placeholderText="Select start date and time"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be in the future. This is when your event begins.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline h-4 w-4 mr-1 text-purple-500" />
                    End Date & Time *
                  </label>
                  <DatePicker
                    selected={formData.endDateTime}
                    onChange={(date) => handleDateChange("endDateTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    minDate={formData.startDateTime || new Date()}
                    placeholderText="Select end date and time"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be after the start date/time.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1 text-orange-500" />
                    Registration Deadline *
                  </label>
                  <DatePicker
                    selected={formData.registrationDeadline}
                    onChange={(date) =>
                      handleDateChange("registrationDeadline", date)
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    minDate={new Date()}
                    maxDate={formData.startDateTime || undefined}
                    placeholderText="Select registration deadline"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be before the event start date/time. Users cannot register after this deadline.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="glass-effect animate-slideUp" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Location Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Location Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {locationTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, locationType: type })}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.locationType === type
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      >
                        {type === "PHYSICAL" && <Building className="h-6 w-6 mx-auto mb-2" />}
                        {type === "ONLINE" && <Globe className="h-6 w-6 mx-auto mb-2" />}
                        {type === "HYBRID" && <MapPin className="h-6 w-6 mx-auto mb-2" />}
                        <div className="text-sm font-medium">{type.charAt(0) + type.slice(1).toLowerCase()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physical/Hybrid Location Fields */}
                {(formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        icon={<Building className="h-5 w-5" />}
                      />
                    </div>

                    <div>
                      <Input
                        label="City *"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        icon={<MapPin className="h-5 w-5" />}
                        required={formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID"}
                      />
                    </div>

                    <div>
                      <Input
                        label="Country *"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                        icon={<Globe className="h-5 w-5" />}
                        required={formData.locationType === "PHYSICAL" || formData.locationType === "HYBRID"}
                      />
                    </div>
                  </div>
                )}

                {/* Online/Hybrid Virtual Link Field */}
                {(formData.locationType === "ONLINE" || formData.locationType === "HYBRID") && (
                  <div className="animate-fadeIn">
                    <Input
                      label="Virtual Meeting Link *"
                      type="url"
                      name="virtualLink"
                      value={formData.virtualLink}
                      onChange={handleInputChange}
                      placeholder="https://zoom.us/meeting/123"
                      icon={<Globe className="h-5 w-5" />}
                      required={formData.locationType === "ONLINE" || formData.locationType === "HYBRID"}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="glass-effect animate-slideUp" style={{ animationDelay: '500ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span>Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="inline h-4 w-4 mr-1 text-blue-500" />
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Any requirements for attendees (e.g., laptop, prior knowledge, experience level)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline h-4 w-4 mr-1 text-green-500" />
                    Agenda
                  </label>
                  <textarea
                    name="agenda"
                    rows={4}
                    value={formData.agenda}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Event schedule and activities (e.g., 9:00 AM - Welcome, 10:00 AM - Keynote, etc.)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 animate-slideUp" style={{ animationDelay: '600ms' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid() || isSubmitting}
              loading={isSubmitting}
              className="w-full sm:w-auto shadow-glow"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
