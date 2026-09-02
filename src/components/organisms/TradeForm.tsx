"use client";

import { useState, type SyntheticEvent } from "react";

import { usePortfolioStore } from "@/features/portfolio/store";
import type { Instrument } from "@/types/instruments";

interface TradeFormProps {
  instrument: Instrument;
  currentPrice: number | undefined;
}

type TradeSide = "buy" | "sell";

export function TradeForm({ instrument, currentPrice }: TradeFormProps) {
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState<TradeSide>("buy");
  const [error, setError] = useState<string | null>(null);

  const buy = usePortfolioStore((state) => state.buy);
  const sell = usePortfolioStore((state) => state.sell);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentPrice === undefined) {
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!parsedQuantity) {
      return;
    }

    const ok =
      side === "buy"
        ? buy(instrument.symbol, parsedQuantity, currentPrice)
        : sell(instrument.symbol, parsedQuantity, currentPrice);

    if (ok) {
      setQuantity("");
      setError(null);
    } else {
      setError(
        side === "buy"
          ? "Niewystarczające środki"
          : "Za mało jednostek",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">{instrument.displayName}</h2>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSide("buy")}
          aria-pressed={side === "buy"}
          className={side === "buy" ? "font-semibold" : ""}
        >
          Kup
        </button>

        <button
          type="button"
          onClick={() => setSide("sell")}
          aria-pressed={side === "sell"}
          className={side === "sell" ? "font-semibold" : ""}
        >
          Sprzedaj
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor={`quantity-${instrument.symbol}`}>Ilość</label>

        <input
          id={`quantity-${instrument.symbol}`}
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          className="block border p-1"
        />
      </div>

      <div className="mb-4">
        Cena: {currentPrice !== undefined ? currentPrice : "Ładowanie..."}
      </div>

      <button
        type="submit"
        disabled={currentPrice === undefined || !quantity}
        className="border px-4 py-1 disabled:opacity-50"
      >
        Wykonaj
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </form>
  );
}
