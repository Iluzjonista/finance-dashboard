import { create } from "zustand";
import { persist } from "zustand/middleware";

import { applyBuy, applySell } from "./logic";
import type {
  PortfolioPosition,
  Transaction,
} from "@/types/instruments";

interface PortfolioStore {
  cashBalancePln: number;
  positions: Record<string, PortfolioPosition>;
  transactions: Transaction[];

  buy: (symbol: string, quantity: number, price: number) => void;
  sell: (symbol: string, quantity: number, price: number) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      cashBalancePln: 10000,
      positions: {},
      transactions: [],

      buy: (symbol, quantity, price) => {
        set((state) => {
          if (quantity <= 0 || price <= 0) {
            return state;
          }

          const cost = quantity * price;

          if (cost > state.cashBalancePln) {
            return state;
          }

          const position = applyBuy(
            state.positions[symbol],
            symbol,
            quantity,
            price,
          );

          const transaction: Transaction = {
            id: crypto.randomUUID(),
            symbol,
            side: "buy",
            quantity,
            price,
            timestamp: Date.now(),
          };

          return {
            cashBalancePln: state.cashBalancePln - cost,
            positions: {
              ...state.positions,
              [symbol]: position,
            },
            transactions: [...state.transactions, transaction],
          };
        });
      },

      sell: (symbol, quantity, price) => {
        set((state) => {
          if (quantity <= 0 || price <= 0) {
            return state;
          }

          const existing = state.positions[symbol];

          if (!existing || quantity > existing.quantity) {
            return state;
          }

          const position = applySell(existing, quantity, price);
          const positions = { ...state.positions };

          if (position === null) {
            delete positions[symbol];
          } else {
            positions[symbol] = position;
          }

          const transaction: Transaction = {
            id: crypto.randomUUID(),
            symbol,
            side: "sell",
            quantity,
            price,
            timestamp: Date.now(),
          };

          return {
            cashBalancePln: state.cashBalancePln + quantity * price,
            positions,
            transactions: [...state.transactions, transaction],
          };
        });
      },
    }),
    {
      name: "portfolio-storage",
    },
  ),
);