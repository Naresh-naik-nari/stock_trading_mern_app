import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider } from "@material-ui/core";

export default function PortfolioWidget() {
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState("connecting");
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
            if (msg.type === 'portfolio_update') {
              setPortfolio(msg.data);
            }
          } catch (err) {
            console.error('Error parsing message:', err);
          }
        };

        ws.onclose = () => {
          setStatus('disconnected');
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
          Portfolio (Real-time)
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
        {portfolio && (
          <>
            <Typography variant="h5" gutterBottom>
              Total Value: ${Number(portfolio.totalValue).toLocaleString()}
            </Typography>
            <Divider />
            <List>
              {portfolio.holdings.map((holding, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${holding.symbol}: ${holding.shares} shares`}
                    secondary={`$${Number(holding.price).toLocaleString()} per share`}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="caption" color="textSecondary" display="block">
              Last updated: {new Date(portfolio.time).toLocaleTimeString()}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
} 