import React from "react";
import Grid from "@material-ui/core/Grid";
import WebSocketStock from "./WebSocketStock";
import SSEStock from "./SSEStock";
import PollingStock from "./PollingStock";
import PortfolioWidget from "./PortfolioWidget";
import NotificationWidget from "./NotificationWidget";
import MultiStockWidget from "./MultiStockWidget";
import NewsFeed from "./NewsFeed";

export default function RealtimeDemo() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}><WebSocketStock /></Grid>
      <Grid item xs={12} md={6} lg={4}><SSEStock /></Grid>
      <Grid item xs={12} md={6} lg={4}><PollingStock /></Grid>
      <Grid item xs={12} md={6} lg={4}><PortfolioWidget /></Grid>
      <Grid item xs={12} md={6} lg={4}><NotificationWidget /></Grid>
    </Grid>
  );
} 