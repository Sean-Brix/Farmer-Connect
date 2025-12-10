import { useState } from 'react';

/**
 * Custom hook to handle request actions (cancel, confirm pickup, confirm return, etc.)
 */
export const useRequestActions = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cancel a pending request
   */
  const cancelRequest = async (requestId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/eic/request/cancel/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel request');
      }

      const data = await response.json();
      
      if (data.success) {
        onSuccess?.('cancel', data);
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to cancel request');
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Confirm item pickup
   */
  const confirmPickup = async (requestId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/eic/request/confirm-pickup/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to confirm pickup');
      }

      const data = await response.json();
      
      if (data.success) {
        onSuccess?.('confirm-pickup', data);
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to confirm pickup');
      }
    } catch (err) {
      console.error('Error confirming pickup:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Confirm item return
   */
  const confirmReturn = async (requestId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/eic/request/confirm-return/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to confirm return');
      }

      const data = await response.json();
      
      if (data.success) {
        onSuccess?.('confirm-return', data);
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to confirm return');
      }
    } catch (err) {
      console.error('Error confirming return:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request extension for borrowing period
   */
  const requestExtension = async (requestId, newReturnDate, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/eic/request/extend/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          newReturnDate,
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to request extension');
      }

      const data = await response.json();
      
      if (data.success) {
        onSuccess?.('extension', data);
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to request extension');
      }
    } catch (err) {
      console.error('Error requesting extension:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    cancelRequest,
    confirmPickup,
    confirmReturn,
    requestExtension
  };
};

export default useRequestActions;
