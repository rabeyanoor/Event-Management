import {
  Event,
  EventCategory,
  EventStatus,
  Registration,
  LocationType,
} from "../types";
import { fetchWithAuth } from "./fetchWithAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

class EventService {
  private getAuthHeader() {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getEvents() {
    const res = await fetchWithAuth(`${API_BASE}/events`, {
      headers: { ...this.getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    // Map backend events to include nested location object
    const events = (data.content || []).map((event: any) => ({
      ...event,
      location: {
        type: event.locationType,
        address: event.address,
        city: event.city,
        country: event.country,
        virtualLink: event.virtualLink,
      },
    }));
    return events;
  }

  async getEventById(id: string) {
    const res = await fetchWithAuth(`${API_BASE}/events/${id}`, {
      headers: { ...this.getAuthHeader() },
    });
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Event not found or has been cancelled");
      }
      throw new Error("Failed to fetch event");
    }
    const event = await res.json();
    // Map backend event to include nested location object
    return {
      ...event,
      location: {
        type: event.locationType,
        address: event.address,
        city: event.city,
        country: event.country,
        virtualLink: event.virtualLink,
      },
    };
  }

  async createEvent(eventData: any) {
    const res = await fetchWithAuth(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error("Failed to create event");
    return res.json();
  }

  async updateEvent(id: string, eventData: any) {
    const res = await fetchWithAuth(`${API_BASE}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || "Failed to update event");
      (error as any).response = res;
      (error as any).data = errorData;
      throw error;
    }
    return res.json();
  }

  async deleteEvent(id: string) {
    const res = await fetchWithAuth(`${API_BASE}/events/${id}`, {
      method: "DELETE",
      headers: { ...this.getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to delete event");
    return true;
  }

  searchEvents(query: string, category?: EventCategory): Event[] {
    const events = localStorage.getItem("events");
    return events ? JSON.parse(events) : this.getDefaultEvents();
  }

  getEventsByOrganizer(organizerId: string): Event[] {
    const events = localStorage.getItem("events");
    return events ? JSON.parse(events) : this.getDefaultEvents();
  }

  private getDefaultEvents(): Event[] {
    const defaultEvents: Event[] = [
      {
        id: "event-1",
        title: "Tech Conference 2025",
        description:
          "Annual technology conference featuring the latest innovations in software development, AI, and digital transformation.",
        category: "CONFERENCE",
        organizerId: "organizer-1",
        startDateTime: "2025-03-15T09:00:00Z",
        endDateTime: "2025-03-15T17:00:00Z",
        location: {
          type: "PHYSICAL",
          address: "123 Tech Center",
          city: "San Francisco",
          country: "USA",
        },
        capacity: 500,
        registrationDeadline: "2025-03-10T23:59:59Z",
        status: "PUBLISHED",
        tags: ["technology", "innovation", "networking"],
        imageUrl:
          "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
        requirements: "Laptop recommended",
        agenda: "Keynote speeches, workshops, networking sessions",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      {
        id: "event-2",
        title: "React Workshop",
        description:
          "Hands-on workshop covering advanced React patterns, hooks, and performance optimization techniques.",
        category: "WORKSHOP",
        organizerId: "organizer-1",
        startDateTime: "2025-02-20T14:00:00Z",
        endDateTime: "2025-02-20T18:00:00Z",
        location: {
          type: "ONLINE",
          virtualLink: "https://zoom.us/meeting/123",
        },
        capacity: 50,
        registrationDeadline: "2025-02-18T23:59:59Z",
        status: "PUBLISHED",
        tags: ["react", "javascript", "frontend"],
        imageUrl:
          "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
        requirements: "Basic React knowledge required",
        agenda: "Advanced patterns, performance tips, Q&A",
        createdAt: "2025-01-05T00:00:00Z",
        updatedAt: "2025-01-05T00:00:00Z",
      },
    ];

    localStorage.setItem("events", JSON.stringify(defaultEvents));
    return defaultEvents;
  }
}

export const eventService = new EventService();
