
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Connect to backend
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
            withCredentials: true,
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return socket;
};
