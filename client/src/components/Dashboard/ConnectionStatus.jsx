import React from "react";
import { Box, Chip, Tooltip } from "@material-ui/core";
import { 
  Wifi, 
  WifiOff, 
  Sync, 
  Error as ErrorIcon 
} from "@material-ui/icons";
import { useWebSocket } from "../../context/WebSocketContext";
import "./ConnectionStatus.css";

const ConnectionStatus = () => {
  const { status, error } = useWebSocket();

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: <Wifi />,
          label: "Live Data",
          color: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tooltip: "Real-time data connection active"
        };
      case "connecting":
        return {
          icon: <Sync className="rotating" />,
          label: "Connecting",
          color: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          tooltip: "Establishing connection..."
        };
      case "disconnected":
        return {
          icon: <WifiOff />,
          label: "Offline",
          color: "#f44336",
          backgroundColor: "rgba(244, 67, 54, 0.1)",
          tooltip: "Connection lost - attempting to reconnect"
        };
      case "error":
        return {
          icon: <ErrorIcon />,
          label: "Error",
          color: "#f44336",
          backgroundColor: "rgba(244, 67, 54, 0.1)",
          tooltip: error || "Connection error occurred"
        };
      default:
        return {
          icon: <WifiOff />,
          label: "Unknown",
          color: "#9e9e9e",
          backgroundColor: "rgba(158, 158, 158, 0.1)",
          tooltip: "Connection status unknown"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Box position="fixed" top={80} right={16} zIndex={1000}>
      <Tooltip title={config.tooltip} arrow>
        <Chip
          icon={config.icon}
          label={config.label}
          size="small"
          style={{
            backgroundColor: config.backgroundColor,
            color: config.color,
            border: `1px solid ${config.color}`,
            fontWeight: 500,
            fontSize: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)'
          }}
        />
      </Tooltip>

    </Box>
  );
};

export default ConnectionStatus;