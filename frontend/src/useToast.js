import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type }), 3500);
  }, []);
  const closeToast = useCallback(() => setToast({ message: '', type: toast.type }), [toast.type]);
  return [toast, showToast, closeToast];
}
