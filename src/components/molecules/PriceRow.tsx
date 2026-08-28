import type { Instrument, PriceTick } from "@/types/instruments";

import { PriceChangeBadge } from "../atoms/PriceChangeBadge";

interface PriceRowProps {
  instrument: Instrument;
  tick: PriceTick | undefined;
}

export function PriceRow({ instrument, tick }: PriceRowProps) {
  return (
    <div>
      <span>{instrument.displayName}</span>

      <span>{tick ? tick.price : "…"}</span>

      <PriceChangeBadge changePercent={tick?.changePercent} />
    </div>
  );
}
