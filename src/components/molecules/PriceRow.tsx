import type { Instrument, PriceTick } from "@/types/instruments";
import { useWatchlistStore } from "@/features/watchlist/store";

import { PriceChangeBadge } from "../atoms/PriceChangeBadge";

interface PriceRowProps {
  instrument: Instrument;
  tick: PriceTick | undefined;
}

export function PriceRow({ instrument, tick }: PriceRowProps) {
  const add = useWatchlistStore((s) => s.add);
  const remove = useWatchlistStore((s) => s.remove);
  const isInstrumentWatched = useWatchlistStore(
    (s) => s.instruments.some((i) => i.symbol === instrument.symbol),
  );

  return (
    <li className="flex items-center gap-4 py-2">
      <span>{instrument.displayName}</span>

      <span>{tick ? tick.price : "..."}</span>

      <PriceChangeBadge changePercent={tick?.changePercent} />

      <button
        onClick={() =>
          isInstrumentWatched
            ? remove(instrument.symbol)
            : add(instrument)
        }
        className="ml-auto"
      >
        {isInstrumentWatched ? "Remove" : "Watch"}
      </button>
    </li>
  );
}
