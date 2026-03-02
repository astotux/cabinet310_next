export interface Service {
  id: string;
  name: string;
  master: string;
  duration?: number;
}

export interface Booking {
  id: number;
  service: string;
  master: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  createdAt: Date;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: Date;
}

export interface AvailabilityResponse {
  available: boolean;
  reason?: string;
}
