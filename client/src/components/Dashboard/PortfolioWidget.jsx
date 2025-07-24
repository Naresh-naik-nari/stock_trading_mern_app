import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider } from "@material-ui/core";
import { useWebSocket } from "../../context/WebSocketContext";

export default function PortfolioWidget() {
  const { status, error, messages } = useWebSocket();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const portfolioMessages = messages.filter(msg => msg.type === "portfolio_update");
    if (portfolioMessages.length > 0) {
      setPortfolio(portfolioMessages[0].data);
    }
  }, [messages]);

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
        {status === "connecting" && <CircularProgress size={20} />}
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
