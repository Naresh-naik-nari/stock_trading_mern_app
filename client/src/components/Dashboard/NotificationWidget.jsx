import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider, Chip } from "@material-ui/core";
import { Notifications as NotificationsIcon } from "@material-ui/icons";
import { useWebSocket } from "../../context/WebSocketContext";

export default function NotificationWidget() {
  const { status, error, messages } = useWebSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationMessages = messages.filter(msg => msg.type === "notification");
    setNotifications(notificationMessages.slice(0, 10));
  }, [messages]);

  const getNotificationColor = (message) => {
    if (message.includes("alert") || message.includes("volatility")) return "secondary";
    if (message.includes("opportunity") || message.includes("up")) return "primary";
    if (message.includes("rebalancing")) return "secondary";
    return "default";
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <NotificationsIcon style={{ marginRight: 8, verticalAlign: "middle" }} />
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
        {status === "connecting" && <CircularProgress size={20} />}
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
                      secondary={notification.timestamp && new Date(notification.timestamp).toLocaleTimeString()}
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
