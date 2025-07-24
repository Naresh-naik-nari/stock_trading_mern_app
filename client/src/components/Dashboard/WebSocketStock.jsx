import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@material-ui/core";
import { useWebSocket } from "../../context/WebSocketContext";

export default function WebSocketStock() {
  const { status, error, messages } = useWebSocket();
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const stockMessages = messages.filter(msg => msg.type === "stock_update");
    if (stockMessages.length > 0) {
      setStock(stockMessages[0].data);
    }
  }, [messages]);

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
        {status === "connecting" && <CircularProgress size={20} />}
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
