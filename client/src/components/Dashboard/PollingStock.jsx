import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@material-ui/core";
import { Refresh as RefreshIcon } from "@material-ui/icons";
import axios from "axios";

export default function PollingStock() {
  const [stock, setStock] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setStatus('fetching');
        const res = await axios.get("http://localhost:5000/api/stock/price");
        setStock(res.data);
        setStatus('connected');
        setError(null);
      } catch (err) {
        setStatus('error');
        setError('Failed to fetch stock data');
        console.error('Polling error:', err);
      }
    };

    fetchStock();
    const interval = setInterval(fetchStock, 2000); // Poll every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <RefreshIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Stock Price (Polling)
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