"use client"

import { io, Socket } from 'socket.io-client';

export let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
    path: '/api/socket/io',
    addTrailingSlash: false,
    auth: { userId },
    forceNew: false,
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
