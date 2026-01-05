// src/services/pickup.ts
import api from './api';
import type { 
  Pickup, 
  CreatePickupData, 
  UpdatePickupData,
  PickupFilter,
  PickupStats
} from '../types';

const pickupService = {
  // Get all pickups (admin only)
  getAllPickups: async (filters?: PickupFilter): Promise<Pickup[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.wasteType && filters.wasteType !== 'all') {
        params.append('wasteType', filters.wasteType);
      }
      if (filters.userId) {
        params.append('userId', filters.userId);
      }
      if (filters.driverId) {
        params.append('driverId', filters.driverId);
      }
    }
    
    const url = `/pickups${params.toString() ? `?${params.toString()}` : ''}`;
    const response: Pickup[] = await api.get(url);
    return response;
  },

  // Get pickup by ID
  getPickupById: async (id: string): Promise<Pickup> => {
    const response : Pickup = await api.get(`/pickups/${id}`);
    return response;
  },

  // Get current user's pickups
  getMyPickups: async (filters?: PickupFilter): Promise<Pickup[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.wasteType && filters.wasteType !== 'all') {
        params.append('wasteType', filters.wasteType);
      }
    }
    
    const url = `/pickups/my${params.toString() ? `?${params.toString()}` : ''}`;
    const response: Pickup[] = await api.get(url);
    return response;
  },

  // Get pickups for a specific driver
  getDriverPickups: async (driverId: string, filters?: PickupFilter): Promise<Pickup[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.wasteType && filters.wasteType !== 'all') {
        params.append('wasteType', filters.wasteType);
      }
    }
    
    const url = `/pickups/driver/${driverId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response: Pickup[] = await api.get(url);
    return response;
  },

  // Schedule a new pickup
  schedulePickup: async (data: CreatePickupData): Promise<Pickup> => {
    const response: Pickup = await api.post('/pickups', data);
    return response;
  },

  // Update pickup
  updatePickup: async (id: string, data: UpdatePickupData): Promise<Pickup> => {
    const response: Pickup = await api.put(`/pickups/${id}`, data);
    return response;
  },

  // Assign driver to pickup
  assignDriver: async (pickupId: string, driverId: string): Promise<Pickup> => {
    const response: Pickup = await api.put(`/pickups/${pickupId}/assign`, { driverId });
    return response;
  },

  // Cancel pickup
  cancelPickup: async (id: string, reason?: string): Promise<Pickup> => {
    const response: Pickup = await api.put(`/pickups/${id}/cancel`, { reason });
    return response;
  },

  // Start pickup (driver only)
  startPickup: async (id: string): Promise<Pickup> => {
    const response: Pickup = await api.put(`/pickups/${id}/start`);
    return response;
  },

  // Complete pickup (driver only)
  completePickup: async (id: string): Promise<Pickup> => {
    const response: Pickup = await api.put(`/pickups/${id}/complete`);
    return response;
  },

  // Get pickup statistics
  getPickupStats: async (userId?: string): Promise<PickupStats> => {
    const params = new URLSearchParams();
    
    if (userId) {
      params.append('userId', userId);
    }
    
    const url = `/pickups/stats${params.toString() ? `?${params.toString()}` : ''}`;
    const response: PickupStats = await api.get(url);
    return response;
  },

  // Estimate pickup price
  estimatePrice: async (data: {
    wasteType: Pickup['wasteType'];
    quantity: string;
  }): Promise<{ price: number; currency: string; estimatedTime: number }> => {
    const response: { price: number; currency: string; estimatedTime: number } = await api.post('/pickups/estimate', data);
    return response;
  },
  async ratePickup(id: string, rating: number, feedback?: string): Promise<Pickup> {
    const { data } = await api.post(`/pickups/${id}/rate`, { rating, feedback });
    return data;
  },
  async uploadPickupPhoto(id: string, photo: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', photo);
    const { data } = await api.post(`/pickups/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default pickupService;