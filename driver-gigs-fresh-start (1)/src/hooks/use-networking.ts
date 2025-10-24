import { useState, useEffect, useCallback } from 'react';

interface NetworkingGroup {
  id: string;
  name: string;
  platform: string;
  url?: string | null;
  email?: string | null;
  username?: string | null;
  joinedDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateNetworkingGroupData {
  name: string;
  platform: string;
  url?: string;
  email?: string;
  username?: string;
  joinedDate?: Date;
  notes?: string;
}

interface UseNetworkingReturn {
  groups: NetworkingGroup[];
  isLoading: boolean;
  error: string | null;
  createGroup: (data: CreateNetworkingGroupData) => Promise<NetworkingGroup>;
  updateGroup: (id: string, data: CreateNetworkingGroupData) => Promise<NetworkingGroup>;
  deleteGroup: (id: string) => Promise<void>;
  refreshGroups: () => Promise<void>;
}

export function useNetworking(): UseNetworkingReturn {
  const [groups, setGroups] = useState<NetworkingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/networking');
      
      if (!response.ok) {
        throw new Error('Failed to fetch networking groups');
      }

      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch networking groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (data: CreateNetworkingGroupData): Promise<NetworkingGroup> => {
    try {
      setError(null);
      const response = await fetch('/api/networking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          joinedDate: data.joinedDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create networking group');
      }

      const newGroup = await response.json();
      setGroups(prev => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create networking group');
      throw err;
    }
  }, []);

  const updateGroup = useCallback(async (id: string, data: CreateNetworkingGroupData): Promise<NetworkingGroup> => {
    try {
      setError(null);
      const response = await fetch(`/api/networking/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          joinedDate: data.joinedDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update networking group');
      }

      const updatedGroup = await response.json();
      setGroups(prev => prev.map(group => 
        group.id === id ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update networking group');
      throw err;
    }
  }, []);

  const deleteGroup = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`/api/networking/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete networking group');
      }

      setGroups(prev => prev.filter(group => group.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete networking group');
      throw err;
    }
  }, []);

  const refreshGroups = useCallback(async () => {
    setIsLoading(true);
    await fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    refreshGroups,
  };
}
