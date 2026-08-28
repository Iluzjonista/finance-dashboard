"use client";

import { PriceRow } from "@/components/molecules/PriceRow";
import { useLivePrices } from "@/lib/ws/useLivePrices";
import { CRYPTO_INSTRUMENTS } from "@/lib/instruments";
import { BinanceConsole } from "@/features/instruments/BinanceConsole";

export default function Home() {
  const symbols = CRYPTO_INSTRUMENTS.map((instrument) => instrument.symbol);
  const prices = useLivePrices(symbols);

  return (
    <main>
      <h1>Live prices</h1>

      {CRYPTO_INSTRUMENTS.map((instrument) => (
        <PriceRow
          key={instrument.symbol}
          instrument={instrument}
          tick={prices[instrument.symbol]}
        />
      ))}
      <BinanceConsole />
    </main>
  );
}
