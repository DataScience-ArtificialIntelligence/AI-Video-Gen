// src/hooks/useSSEProgress.js
import { useEffect, useState, useRef } from 'react';

export const useSSEProgress = (generationId, autoConnect = true) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!generationId || !autoConnect) return;

    console.log('🔌 useSSEProgress: Connecting for ID:', generationId);

    // Create EventSource connection
    const eventSource = new EventSource(
      `http://localhost:8000/api/progress/${generationId}`
    );

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ useSSEProgress: Connection opened');
      setIsConnected(true);
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        message: '📡 Connected to progress stream',
        progress: 0,
        status: 'connected'
      }]);
    };

    eventSource.onmessage = (event) => {
      console.log('📨 useSSEProgress: Received data:', event.data);
      
      try {
        const data = JSON.parse(event.data);
        
        setProgress(data.progress || 0);
        setStatus(data.status || 'processing');
        setMessage(data.message || '');
        
        // Add to logs (avoid duplicates)
        setLogs((prev) => {
          const lastLog = prev[prev.length - 1];
          if (lastLog && lastLog.message === data.message) {
            return prev; // Skip duplicate
          }
          return [
            ...prev,
            {
              timestamp: data.timestamp || new Date().toLocaleTimeString(),
              message: data.message || 'Processing...',
              progress: data.progress || 0,
              status: data.status || 'processing',
            },
          ];
        });

        // Close connection if completed or error
        if (data.status === 'completed' || data.status === 'error' || data.status === 'done') {
          console.log('🏁 useSSEProgress: Closing connection');
          eventSource.close();
        }
      } catch (error) {
        console.error('❌ useSSEProgress: Parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ useSSEProgress: Connection error:', error);
      
      if (eventSource.readyState === EventSource.CLOSED) {
        setIsConnected(false);
        eventSource.close();
      }
    };

    // Cleanup on unmount
    return () => {
      console.log('🧹 useSSEProgress: Cleaning up');
      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
    };
  }, [generationId, autoConnect]);

  const clearLogs = () => {
    setLogs([]);
    setProgress(0);
    setMessage('');
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsConnected(false);
    }
  };

  return { 
    progress, 
    status, 
    message, 
    logs, 
    isConnected,
    clearLogs,
    disconnect
  };
};
