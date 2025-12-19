import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);
  const shouldReconnect = useRef(true);
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connectWebSocket = () => {
      setStatus("connecting");
      setError(null);
      wsRef.current = new WebSocket("ws://localhost:5001/ws");

      wsRef.current.onopen = () => {
        setStatus("connected");
        setError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        if (event.data === "ping") {
          wsRef.current.send("pong");
          console.log("Received ping, sent pong");
          return;
        }
        try {
          const msg = JSON.parse(event.data);
          setMessages((prev) => [msg, ...prev]);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason, "readyState:", wsRef.current.readyState);
        setStatus("disconnected");
        if (shouldReconnect.current) {
          const timeout = Math.min(10000, 1000 * 2 ** reconnectAttempts.current);
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connectWebSocket();
          }, timeout);
          console.log(`Reconnecting in ${timeout} ms`);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error("WebSocket error event:", event, "readyState:", wsRef.current.readyState);
        setStatus("error");
        setError("Connection error occurred");
      };
    };

    connectWebSocket();

    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      setTimeout(() => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
          wsRef.current.close();
        }
      }, 100);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ status, error, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
