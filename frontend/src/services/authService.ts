import { User, UserRole } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("auth_token", data.accessToken);
    // Optionally fetch user profile here and store it
    return data;
  }

  async register(userData: Partial<User>) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Registration failed");
    // Optionally auto-login after registration
    return true;
  }

  logout(): void {
    localStorage.removeItem("auth_token");
    // Optionally remove user data
  }

  private generateToken(user: User): string {
    return btoa(JSON.stringify({ id: user.id, email: user.email }));
  }

  private getUsers(): User[] {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : this.getDefaultUsers();
  }

  private getDefaultUsers(): User[] {
    const defaultUsers: User[] = [
      {
        id: "admin-1",
        email: "admin@eventflow.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        phone: "+1234567890",
        role: "ADMIN",
        preferences: {
          categories: [],
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: "organizer-1",
        email: "organizer@eventflow.com",
        password: "organizer123",
        firstName: "Event",
        lastName: "Organizer",
        phone: "+1234567891",
        role: "ORGANIZER",
        preferences: {
          categories: ["CONFERENCE", "WORKSHOP"],
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
}

export const authService = new AuthService();
