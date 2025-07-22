import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@material-ui/core";

export default function WebSocketStock() {
  const [stock, setStock] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);

  useEffect(() => {
    let ws = null;
    const connectWebSocket = () => {
      try {
        ws = new WebSocket('ws://localhost:5000/ws');
        
        ws.onopen = () => {
          setStatus('connected');
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'stock_update') {
              setStock(msg.data);
            }
          } catch (err) {
            console.error('Error parsing message:', err);
          }
        };

        ws.onclose = () => {
          setStatus('disconnected');
          // Try to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (err) => {
          setStatus('error');
          setError('Connection error occurred');
          console.error('WebSocket error:', err);
        };
      } catch (err) {
        setStatus('error');
        setError('Failed to establish connection');
        console.error('WebSocket connection error:', err);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Real-time Stock Price (WebSocket)
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Status: {status}
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        {status === 'connecting' && <CircularProgress size={20} />}
        {stock && (
          <Typography variant="h5">
            {stock.symbol}: ${stock.price}
            <Typography variant="caption" display="block">
              Last updated: {new Date(stock.time).toLocaleTimeString()}
            </Typography>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 