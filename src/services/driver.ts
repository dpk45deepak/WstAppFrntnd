// src/services/driver.ts
import api from './api';
// import type {  User } from '../types';

export interface DriverLocation {
  driverId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'busy' | 'offline';
  timestamp: string;
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'driver';
  createdAt: string;
  updatedAt: string;
}

const driverService = {
  // Update or create driver's location
  updateLocation: async (lat: number, lng: number, status: 'available' | 'busy' | 'offline' = 'available'): Promise<DriverLocation> => {
    const response: DriverLocation = await api.post('/driver/location', {
      lat,
      lng,
      status,
    });
    return response;
  },

  // Remove driver's location (go offline)
  removeLocation: async (): Promise<{ message: string }> => {
    const response: { message: string } = await api.delete('/driver/location');
    return response;
  },

  // Get a specific driver's location
  getLocation: async (driverId: string): Promise<DriverLocation> => {
    const response: DriverLocation = await api.get(`/driver/location/${driverId}`);
    return response;
  },

  // Get all available drivers
  getAvailableDrivers: async (status?: string): Promise<DriverLocation[]> => {
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    const url = `/driver/available${params.toString() ? `?${params.toString()}` : ''}`;
    const response: DriverLocation[] = await api.get(url);
    return response;
  },
};

export default driverService;
