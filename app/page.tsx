"use client";

import { useLivePrices } from "@/lib/ws/useLivePrices";
import { BinanceConsole } from "@/features/instruments/BinanceConsole";

export default function Home() {
  const prices = useLivePrices(["BTCUSDT", "ETHUSDT"]);

  return (
    <main>
      <h1>Live prices</h1>

      {Object.values(prices).map((tick) => (
        <div key={tick.symbol}>
          <span>{tick.symbol}</span>
          <span>{tick.price}</span>
        </div>
      ))}
      <BinanceConsole />
    </main>
  );
}
