import { Registration, RegistrationStatus, Event } from "../types";
import { eventService } from "./eventService";
import { fetchWithAuth } from "./fetchWithAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

class RegistrationService {
  private getAuthHeader() {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async registerForEvent(eventId: string, notes?: string) {
    const res = await fetchWithAuth(`${API_BASE}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify({ eventId, notes }),
    });
    if (!res.ok) throw new Error("Failed to register for event");
    return res.json();
  }

  async cancelRegistration(registrationId: string) {
    const res = await fetchWithAuth(
      `${API_BASE}/registrations/${registrationId}`,
      {
        method: "DELETE",
        headers: { ...this.getAuthHeader() },
      }
    );
    if (!res.ok) throw new Error("Failed to cancel registration");
    return true;
  }

  async getUserRegistrations(userId: string) {
    const res = await fetchWithAuth(
      `${API_BASE}/registrations/user/${userId}`,
      {
        headers: { ...this.getAuthHeader() },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch user registrations");
    return res.json();
  }

  async getEventRegistrations(eventId: string) {
    const res = await fetchWithAuth(
      `${API_BASE}/registrations/event/${eventId}`,
      {
        headers: { ...this.getAuthHeader() },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch event registrations");
    return res.json();
  }

  async updateAttendance(registrationId: string, attended: boolean) {
    const res = await fetchWithAuth(
      `${API_BASE}/registrations/${registrationId}/attendance`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ attended }),
      }
    );
    if (!res.ok) throw new Error("Failed to update attendance");
    return true;
  }

  async getRegistrations() {
    const res = await fetchWithAuth(`${API_BASE}/registrations`, {
      headers: { ...this.getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch all registrations");
    return res.json();
  }
}

export const registrationService = new RegistrationService();
