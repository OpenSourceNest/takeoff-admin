import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to backend
    const socketInstance = io(process.env.BACKEND_URL, {
      withCredentials: true,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    socketInstance.on("disconnect", (e) => {
      console.log(e);
      console.log("Websocket disconnected");
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    return () => {
      socketInstance.disconnect();
      console.log("Websocket cleaned up and disconnected");
    };
  }, []);

  return socket;
};
