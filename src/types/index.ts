// src/types/index.ts

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'driver' | 'admin';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Pickup Types
export interface Pickup {
  _id?: string;
  id?: string;
  userId: string;
  userName?: string;
  driverId?: string;
  assignedDriverId?: string;
  driverName?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  pickupDate: string;
  pickupAddress: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  wasteType: 'general' | 'recyclable' | 'hazardous' | 'organic';
  quantity?: string | number;
  images?: string[];
  specialInstructions?: string;
  notes?: string;
  price?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Pickup Creation/Update Types
export interface CreatePickupData {
  pickupDate: string;
  wasteType: 'general' | 'recyclable' | 'hazardous' | 'organic';
  quantity?: string | number;
  pickupAddress?: string;
  images?: string[];
  specialInstructions?: string;
  notes?: string;
}

export interface UpdatePickupData {
  status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  pickupDate?: string;
  pickupAddress?: string;
  address?: string;
  wasteType?: 'general' | 'recyclable' | 'hazardous' | 'organic';
  quantity?: string | number;
  specialInstructions?: string;
  notes?: string;
  driverId?: string;
  reason?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'driver' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
  status?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Driver Types
export interface Driver {
  id: string;
  userId: string;
  licenseNumber?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  capacity?: string; // e.g., "2 tons", "5 cubic yards"
  availability: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  totalPickups?: number;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  pickupId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method?: 'card' | 'cash' | 'bank_transfer';
  transactionId?: string;
  receiptUrl?: string;
  paidAt?: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Statistics Types
export interface PickupStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  revenue?: number;
  averageCompletionTime?: number; // in minutes
}

export interface UserStats {
  totalUsers: number;
  totalDrivers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

// Filter Types
export interface PickupFilter {
  status?: Pickup['status'] | 'all';
  wasteType?: Pickup['wasteType'] | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  userId?: string;
  driverId?: string;
  search?: string;
}

// Form Types
export interface SchedulePickupForm {
  pickupDate: string;
  pickupTime: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  wasteType: 'general' | 'recyclable' | 'hazardous' | 'organic';
  quantity: string;
  notes: string;
}

export interface UserProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}