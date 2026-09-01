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
    <div>
      <span>{instrument.displayName}</span>

      <span>{tick ? tick.price : "..."}</span>

      <PriceChangeBadge changePercent={tick?.changePercent} />

      <button
        onClick={() =>
          isInstrumentWatched
            ? remove(instrument.symbol)
            : add(instrument)
        }
      >
        {isInstrumentWatched ? "Remove" : "Watch"}
      </button>
    </div>
  );
}
