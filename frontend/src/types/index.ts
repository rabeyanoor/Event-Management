export type UserRole = "ORGANIZER" | "ATTENDEE" | "ADMIN";
export type EventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";
export type EventCategory =
  | "CONFERENCE"
  | "WORKSHOP"
  | "WEBINAR"
  | "SOCIAL"
  | "SPORTS";
export type LocationType = "ONLINE" | "PHYSICAL" | "HYBRID";
export type RegistrationStatus = "CONFIRMED" | "WAITLISTED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  preferences: {
    categories: EventCategory[];
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Location {
  type: LocationType;
  address?: string;
  city?: string;
  country?: string;
  virtualLink?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  organizerId: string;
  startDateTime: string;
  endDateTime: string;
  location: Location;
  capacity: number;
  registrationDeadline: string;
  status: EventStatus;
  tags: string[];
  imageUrl?: string;
  requirements?: string;
  agenda?: string;
  createdAt: string;
  updatedAt: string;
  registeredCount: number;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  registrationDate: string;
  notes?: string;
  attended: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  upcomingEvents: number;
  completedEvents: number;
}
