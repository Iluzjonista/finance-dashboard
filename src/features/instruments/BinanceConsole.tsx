'use client';

import { useEffect } from 'react';
import { BinanceSocket } from '@/lib/ws/binanceSocket';

export function BinanceConsole() {
  useEffect(() => {
    const socket = new BinanceSocket(['btcusdt', 'ethusdt']);
    const unsubscribe = socket.subscribe((tick) => {
      console.info('[BinanceConsole] tick', tick);
    });
    socket.connect();

    return () => {
      unsubscribe();
      socket.disconnect();
    };
  }, []);

  return null;
}