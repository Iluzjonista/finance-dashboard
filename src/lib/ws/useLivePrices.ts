"use client";

import { useEffect, useState } from "react";

import { BinanceSocket } from "@/lib/ws/binanceSocket";
import type { PriceTick } from "@/types/instruments";

export const useLivePrices = (symbols: string[]) => {
  const [prices, setPrices] = useState<Record<string, PriceTick>>({});

  useEffect(() => {
    const socket = new BinanceSocket(symbols);

    const unsubscribe = socket.subscribe((tick) => {
      setPrices((prev) => ({
        ...prev,
        [tick.symbol]: tick,
      }));
    });

    socket.connect();

    return () => {
      unsubscribe();
      socket.disconnect();
    };
  }, [symbols.join(",")]);

  return prices;
};