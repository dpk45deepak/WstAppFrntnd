// src/hooks/usePickup.ts
import { useState, useCallback, useEffect } from 'react';
import pickupService from '../services/pickup';
import type { Pickup, CreatePickupData, UpdatePickupData, PickupFilter, PickupStats } from '../types';
import { useAuth } from './useAuth';
import socketService from '../services/socket';

interface UsePickupReturn {
  // State
  pickups: Pickup[];
  currentPickup: Pickup | null;
  loading: boolean;
  error: string | null;
  stats: PickupStats | null;
  
  // Actions
  getPickups: (filters?: PickupFilter) => Promise<Pickup[]>;
  getPickupById: (id: string) => Promise<Pickup>;
  schedulePickup: (data: CreatePickupData) => Promise<Pickup>;
  updatePickup: (id: string, data: UpdatePickupData) => Promise<Pickup>;
  updatePickupStatus: (id: string, status: Pickup['status']) => Promise<Pickup>;
  cancelPickup: (id: string, reason?: string) => Promise<Pickup>;
  assignDriver: (pickupId: string, driverId: string) => Promise<Pickup>;
  startPickup: (id: string) => Promise<Pickup>;
  completePickup: (id: string) => Promise<Pickup>;
  ratePickup: (pickupId: string, rating: number, feedback?: string) => Promise<Pickup>;
  uploadPickupPhoto: (pickupId: string, photo: File) => Promise<{ photoUrl: string }>;
  
  // Filter functions
  filterByStatus: (status: Pickup['status']) => Pickup[];
  filterByWasteType: (wasteType: Pickup['wasteType']) => Pickup[];
  filterByDateRange: (startDate: Date, endDate: Date) => Pickup[];
  searchPickups: (query: string) => Pickup[];
  
  // Statistics
  getStats: () => Promise<PickupStats>;
  refreshStats: () => Promise<void>;
  
  // Real-time
  subscribeToPickupUpdates: (pickupId?: string) => void;
  unsubscribeFromPickupUpdates: () => void;
  
  // Utility
  clearError: () => void;
  clearPickups: () => void;
  setCurrentPickup: (pickup: Pickup | null) => void;
}

export const usePickup = (): UsePickupReturn => {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [currentPickup, setCurrentPickup] = useState<Pickup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PickupStats | null>(null);
  const { user, token } = useAuth();

  // Initialize real-time updates
  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token]);

  const getPickups = useCallback(async (filters?: PickupFilter): Promise<Pickup[]> => {
    setLoading(true);
    setError(null);
    
    try {
      let data: Pickup[];
      
      if (user?.role === 'admin') {
        data = await pickupService.getAllPickups(filters);
      } else if (user?.role === 'driver') {
        data = await pickupService.getDriverPickups(user.id, filters);
      } else {
        data = await pickupService.getMyPickups(filters);
      }
      
      setPickups(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch pickups';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getPickupById = useCallback(async (id: string): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await pickupService.getPickupById(id);
      setCurrentPickup(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch pickup details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const schedulePickup = useCallback(async (data: CreatePickupData): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const newPickup = await pickupService.schedulePickup(data);
      
      // Update local state
      setPickups(prev => [newPickup, ...prev]);
      return newPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to schedule pickup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePickup = useCallback(async (id: string, data: UpdatePickupData): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedPickup = await pickupService.updatePickup(id, data);
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === id ? updatedPickup : pickup
      ));
      
      if (currentPickup?.id === id) {
        setCurrentPickup(updatedPickup);
      }
      
      return updatedPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update pickup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPickup]);

  const updatePickupStatus = useCallback(async (id: string, status: Pickup['status']): Promise<Pickup> => {
    return updatePickup(id, { status });
  }, [updatePickup]);

  const cancelPickup = useCallback(async (id: string, reason?: string): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const cancelledPickup = await pickupService.cancelPickup(id, reason);
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === id ? cancelledPickup : pickup
      ));
      
      if (currentPickup?.id === id) {
        setCurrentPickup(cancelledPickup);
      }
      
      return cancelledPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to cancel pickup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPickup]);

  const assignDriver = useCallback(async (pickupId: string, driverId: string): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedPickup = await pickupService.assignDriver(pickupId, driverId);
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === pickupId ? updatedPickup : pickup
      ));
      
      if (currentPickup?.id === pickupId) {
        setCurrentPickup(updatedPickup);
      }
      
      return updatedPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign driver';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPickup]);

  const startPickup = useCallback(async (id: string): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const startedPickup = await pickupService.startPickup(id);
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === id ? startedPickup : pickup
      ));
      
      if (currentPickup?.id === id) {
        setCurrentPickup(startedPickup);
      }
      
      return startedPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to start pickup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPickup]);

  const completePickup = useCallback(async (id: string): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const completedPickup = await pickupService.completePickup(id);
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === id ? completedPickup : pickup
      ));
      
      if (currentPickup?.id === id) {
        setCurrentPickup(completedPickup);
      }
      
      return completedPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete pickup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPickup]);

  const ratePickup = useCallback(async (pickupId: string, rating: number, feedback?: string): Promise<Pickup> => {
    setLoading(true);
    setError(null);
    
    try {
      const ratedPickup = await pickupService.ratePickup(pickupId, rating, feedback);
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === pickupId ? ratedPickup : pickup
      ));
      
      if (currentPickup?.id === pickupId) {
        setCurrentPickup(ratedPickup);
      }
      
      return ratedPickup;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to rate pickup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPickup]);

  const uploadPickupPhoto = useCallback(async (pickupId: string, photo: File): Promise<{ photoUrl: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await pickupService.uploadPickupPhoto(pickupId, photo);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload photo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter functions
  const filterByStatus = useCallback((status: Pickup['status']): Pickup[] => {
    return pickups.filter(pickup => pickup.status === status);
  }, [pickups]);

  const filterByWasteType = useCallback((wasteType: Pickup['wasteType']): Pickup[] => {
    return pickups.filter(pickup => pickup.wasteType === wasteType);
  }, [pickups]);

  const filterByDateRange = useCallback((startDate: Date, endDate: Date): Pickup[] => {
    return pickups.filter(pickup => {
      const pickupDate = new Date(pickup.pickupDate);
      return pickupDate >= startDate && pickupDate <= endDate;
    });
  }, [pickups]);

  const searchPickups = useCallback((query: string): Pickup[] => {
    if (!query.trim()) return pickups;

    const searchTerm = query.toLowerCase();
    return pickups.filter(pickup =>
      pickup.address!.toLowerCase().includes(searchTerm) ||
      pickup.wasteType.toLowerCase().includes(searchTerm) ||
      (pickup.notes && pickup.notes.toLowerCase().includes(searchTerm)) ||
      pickup.id!.toLowerCase().includes(searchTerm) ||
      (pickup.userName && pickup.userName.toLowerCase().includes(searchTerm)) ||
      (pickup.driverName && pickup.driverName.toLowerCase().includes(searchTerm))
    );
  }, [pickups]);

  // Statistics
  const getStats = useCallback(async (): Promise<PickupStats> => {
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await pickupService.getPickupStats(user?.id);
      setStats(statsData);
      return statsData;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshStats = useCallback(async () => {
    await getStats();
  }, [getStats]);

  // Real-time updates
  const subscribeToPickupUpdates = useCallback((pickupId?: string) => {
    socketService.subscribeToPickupUpdates((updatedPickup: Pickup) => {
      // Update in the list
      setPickups(prev => prev.map(pickup => 
        pickup.id === updatedPickup.id ? updatedPickup : pickup
      ));
      
      // Update current pickup if it's the one being updated
      if (currentPickup?.id === updatedPickup.id) {
        setCurrentPickup(updatedPickup);
      }
    });

    // Subscribe to specific pickup if ID provided
    if (pickupId) {
      socketService.socket?.emit('join:pickup', pickupId);
    }
  }, [currentPickup]);

  const unsubscribeFromPickupUpdates = useCallback(() => {
    socketService.unsubscribeFromPickupUpdates();
  }, []);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPickups = useCallback(() => {
    setPickups([]);
  }, []);

  return {
    // State
    pickups,
    currentPickup,
    loading,
    error,
    stats,
    
    // Actions
    getPickups,
    getPickupById,
    schedulePickup,
    updatePickup,
    updatePickupStatus,
    cancelPickup,
    assignDriver,
    startPickup,
    completePickup,
    ratePickup,
    uploadPickupPhoto,
    
    // Filter functions
    filterByStatus,
    filterByWasteType,
    filterByDateRange,
    searchPickups,
    
    // Statistics
    getStats,
    refreshStats,
    
    // Real-time
    subscribeToPickupUpdates,
    unsubscribeFromPickupUpdates,
    
    // Utility
    clearError,
    clearPickups,
    setCurrentPickup,
  };
};