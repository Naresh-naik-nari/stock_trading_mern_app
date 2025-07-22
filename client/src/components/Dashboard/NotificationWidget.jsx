import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider, Chip } from "@material-ui/core";
import { Notifications as NotificationsIcon } from "@material-ui/icons";

export default function NotificationWidget() {
  const [notifications, setNotifications] = useState([]);
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
            if (msg.type === 'notification') {
              setNotifications((prev) => [msg, ...prev.slice(0, 9)]); // Keep last 10 notifications
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

  const getNotificationColor = (message) => {
    if (message.includes('alert') || message.includes('volatility')) return 'secondary';
    if (message.includes('opportunity') || message.includes('up')) return 'primary';
    if (message.includes('rebalancing')) return 'secondary';
    return 'default';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <NotificationsIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Notifications (Real-time)
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
        {notifications.length > 0 ? (
          <>
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Chip
                          label={notification.message}
                          color={getNotificationColor(notification.message)}
                          size="small"
                          variant="outlined"
                        />
                      }
                      secondary={
                        notification.timestamp && 
                        new Date(notification.timestamp).toLocaleTimeString()
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No notifications yet...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 