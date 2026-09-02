"use client";

import { PriceRow } from "@/components/molecules/PriceRow";
import { useLivePrices } from "@/lib/ws/useLivePrices";
import { CRYPTO_INSTRUMENTS } from "@/lib/instruments";
import { TradeForm } from "@/components/organisms/TradeForm";

export default function Home() {
  const symbols = CRYPTO_INSTRUMENTS.map((instrument) => instrument.symbol);
  const prices = useLivePrices(symbols);
  const instrument = CRYPTO_INSTRUMENTS[0];

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

      <TradeForm
        instrument={instrument}
        currentPrice={prices[instrument.symbol]?.price}
      />

      <h2 className="text-lg font-semibold mt-8 mb-3">Live prices</h2>

      <ul className="divide-y">
        {CRYPTO_INSTRUMENTS.map((inst) => (
          <PriceRow
            key={inst.symbol}
            instrument={inst}
            tick={prices[inst.symbol]}
          />
        ))}
      </ul>
    </main>
  );
}
