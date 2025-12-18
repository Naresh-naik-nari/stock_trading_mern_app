import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@material-ui/core";
import { Timeline as TimelineIcon } from "@material-ui/icons";

export default function SSEStock() {
  const [stock, setStock] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);

  useEffect(() => {
    let eventSource = null;
    const connectSSE = () => {
      try {
        eventSource = new EventSource("http://localhost:5001/api/stream/stock");

        eventSource.onopen = () => {
          setStatus('connected');
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            setStock(JSON.parse(event.data));
          } catch (err) {
            console.error('Error parsing SSE data:', err);
          }
        };

        eventSource.onerror = (err) => {
          setStatus('error');
          setError('SSE connection error');
          console.error('SSE error:', err);
          eventSource.close();
          // Try to reconnect after 3 seconds
          setTimeout(connectSSE, 3000);
        };
      } catch (err) {
        setStatus('error');
        setError('Failed to establish SSE connection');
        console.error('SSE connection error:', err);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <TimelineIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Stock Price (SSE)
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