import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch pickup slots for a specific date
 */
export const usePickupSlots = (date) => {
  const [slots, setSlots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (date) {
      fetchSlots(date);
    } else {
      setSlots(null);
    }
  }, [date]);

  const fetchSlots = async (selectedDate) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/eic/pickup-slots/${selectedDate}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pickup slots');
      }

      const result = await response.json();
      
      if (result.success) {
        setSlots(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch slots');
      }
    } catch (err) {
      console.error('Error fetching pickup slots:', err);
      setError(err.message);
      setSlots(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    slots,
    loading,
    error,
    refetch: () => date && fetchSlots(date)
  };
};

export default usePickupSlots;
