import { useState, useEffect, useCallback } from 'react';

interface Vehicle {
  id: string;
  nickname: string;
  year?: number | null;
  make: string;
  model: string;
  vehicleType?: string | null;
  color?: string | null;
  vin?: string | null;
  licensePlate?: string | null;
  state?: string | null;
  mileage?: number | null;
  fuelType?: string | null;
  mpg?: number | null;
  ownerNames?: string | null;
  purchaseLocation?: string | null;
  financialInfo?: any;
  specifications?: any;
  insuranceInfo?: any;
  vehiclePhotos?: any;
  insuranceDocs?: any;
  registrationDocs?: any;
  warrantyDocs?: any;
  maintenanceDocs?: any;
  otherDocs?: any;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateVehicleData {
  nickname: string;
  year?: number;
  make: string;
  model: string;
  vehicleType?: string;
  color?: string;
  vin?: string;
  licensePlate?: string;
  state?: string;
  mileage?: number;
  fuelType?: string;
  mpg?: number;
  ownerNames?: string;
  purchaseLocation?: string;
  financialInfo?: any;
  specifications?: any;
  insuranceInfo?: any;
  vehiclePhotos?: any;
  insuranceDocs?: any;
  registrationDocs?: any;
  warrantyDocs?: any;
  maintenanceDocs?: any;
  otherDocs?: any;
  notes?: string;
}

interface UseFleetReturn {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  createVehicle: (data: CreateVehicleData) => Promise<Vehicle>;
  updateVehicle: (id: string, data: CreateVehicleData) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  refreshVehicles: () => Promise<void>;
}

export function useFleet(): UseFleetReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/fleet');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVehicle = useCallback(async (data: CreateVehicleData): Promise<Vehicle> => {
    try {
      setError(null);
      const response = await fetch('/api/fleet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create vehicle');
      }

      const newVehicle = await response.json();
      setVehicles(prev => [newVehicle, ...prev]);
      return newVehicle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vehicle');
      throw err;
    }
  }, []);

  const updateVehicle = useCallback(async (id: string, data: CreateVehicleData): Promise<Vehicle> => {
    try {
      setError(null);
      const response = await fetch(`/api/fleet/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update vehicle');
      }

      const updatedVehicle = await response.json();
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === id ? updatedVehicle : vehicle
      ));
      return updatedVehicle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vehicle');
      throw err;
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`/api/fleet/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete vehicle');
      }

      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
      throw err;
    }
  }, []);

  const refreshVehicles = useCallback(async () => {
    setIsLoading(true);
    await fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refreshVehicles,
  };
}
