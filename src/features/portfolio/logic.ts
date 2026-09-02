import type { PortfolioPosition } from "@/types/instruments";

export function applyBuy(
  existing: PortfolioPosition | undefined,
  symbol: string,
  quantity: number,
  price: number,
): PortfolioPosition {
  if (!existing) {
    return {
      symbol,
      quantity,
      averageBuyPrice: price,
    };
  }

  const totalQuantity = existing.quantity + quantity;

  const totalCost =
    existing.quantity * existing.averageBuyPrice + quantity * price;

  return {
    symbol,
    quantity: totalQuantity,
    averageBuyPrice: totalCost / totalQuantity,
  };
}

export function applySell(
  existing: PortfolioPosition,
  quantity: number,
  price: number,
): PortfolioPosition | null {
  const remainingQuantity = existing.quantity - quantity;
  const EPSILON = 1e-8;
  if (remainingQuantity <= EPSILON) {
    return null;
  }

  return {
    symbol: existing.symbol,
    quantity: remainingQuantity,
    averageBuyPrice: existing.averageBuyPrice,
  };
}

export function calculateUnrealizedPnl(
  position: PortfolioPosition,
  currentPrice: number,
): {
  marketValue: number;
  costBasis: number;
  pnl: number;
  pnlPercent: number;
} {
  const marketValue = position.quantity * currentPrice;
  const costBasis = position.quantity * position.averageBuyPrice;
  const pnl = marketValue - costBasis;

  const pnlPercent = costBasis === 0 ? 0 : (pnl / costBasis) * 100;

  return {
    marketValue,
    costBasis,
    pnl,
    pnlPercent,
  };
}
