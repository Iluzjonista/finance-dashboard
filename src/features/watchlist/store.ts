import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Instrument } from '@/types/instruments';

interface WatchlistState {
  instruments: Instrument[];
  add: (instrument: Instrument) => void;
  remove: (symbol: string) => void;
  isWatched: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      instruments: [],
      add: (instrument) =>
        set((state) => {
          if (state.instruments.some((i) => i.symbol === instrument.symbol)) {
            return state;
          }
          return { instruments: [...state.instruments, instrument] };
        }),
      remove: (symbol) =>
        set((state) => ({
          instruments: state.instruments.filter((i) => i.symbol !== symbol),
        })),
      isWatched: (symbol) =>
        get().instruments.some((i) => i.symbol === symbol),
    }),
    { name: 'watchlist-storage' },
  ),
);
