import { fetchWithAuth } from "./fetchWithAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface UserUpdateData {
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  preferences?: string[];
  notifications?: boolean;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  profileImage?: string;
  preferences?: string[];
  notifications?: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

class UserService {
  private getAuthHeader() {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getProfile(): Promise<UserProfileResponse> {
    const res = await fetchWithAuth(`${API_BASE}/users/profile`, {
      headers: { ...this.getAuthHeader() },
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }
    
    return res.json();
  }

  async updateProfile(userData: UserUpdateData): Promise<UserProfileResponse> {
    const res = await fetchWithAuth(`${API_BASE}/users/profile`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        ...this.getAuthHeader() 
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || "Failed to update profile");
      (error as any).response = res;
      (error as any).data = errorData;
      throw error;
    }
    
    return res.json();
  }
}

export const userService = new UserService();