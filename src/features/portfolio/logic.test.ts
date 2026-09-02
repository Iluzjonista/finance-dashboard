import { describe, it, expect } from "vitest";
import { applyBuy, applySell, calculateUnrealizedPnl } from "./logic";
import type { PortfolioPosition } from "@/types/instruments";

describe("applyBuy", () => {
  it("creates a new position when none exists", () => {
    const result = applyBuy(undefined, "BTC", 0.5, 200_000);

    expect(result).toEqual({
      symbol: "BTC",
      quantity: 0.5,
      averageBuyPrice: 200_000,
    });
  });

  it("calculates weighted average price when buying more", () => {
    const existing: PortfolioPosition = {
      symbol: "BTC",
      quantity: 0.5,
      averageBuyPrice: 200_000,
    };

    const result = applyBuy(existing, "BTC", 0.3, 210_000);

    expect(result.quantity).toBeCloseTo(0.8);
    expect(result.averageBuyPrice).toBeCloseTo(203_750);
  });

  it("keeps average unchanged when buying at same price", () => {
    const existing: PortfolioPosition = {
      symbol: "ETH",
      quantity: 2,
      averageBuyPrice: 3_000,
    };

    const result = applyBuy(existing, "ETH", 1, 3_000);

    expect(result.quantity).toBe(3);
    expect(result.averageBuyPrice).toBe(3_000);
  });

  it("lowers average when buying at a lower price", () => {
    const existing: PortfolioPosition = {
      symbol: "BTC",
      quantity: 1,
      averageBuyPrice: 100_000,
    };

    const result = applyBuy(existing, "BTC", 1, 50_000);

    expect(result.quantity).toBe(2);
    expect(result.averageBuyPrice).toBe(75_000);
  });

  it("uses the symbol argument, not the existing symbol", () => {
    const existing: PortfolioPosition = {
      symbol: "OLD",
      quantity: 1,
      averageBuyPrice: 100,
    };

    const result = applyBuy(existing, "NEW", 1, 200);

    expect(result.symbol).toBe("NEW");
  });

  it("handles very small quantities", () => {
    const existing: PortfolioPosition = {
      symbol: "BTC",
      quantity: 1,
      averageBuyPrice: 100_000,
    };

    const result = applyBuy(existing, "BTC", 0.00001, 200_000);

    expect(result.quantity).toBeCloseTo(1.00001);
    expect(result.averageBuyPrice).toBeCloseTo(100_000.99999, 4);
  });
});

describe("applySell", () => {
  it("reduces quantity and keeps average price", () => {
    const existing: PortfolioPosition = {
      symbol: "BTC",
      quantity: 1,
      averageBuyPrice: 100_000,
    };

    const result = applySell(existing, 0.3, 150_000);

    expect(result).not.toBeNull();
    expect(result!.quantity).toBeCloseTo(0.7);
    expect(result!.averageBuyPrice).toBe(100_000);
  });

  it("returns null when selling all", () => {
    const existing: PortfolioPosition = {
      symbol: "BTC",
      quantity: 1,
      averageBuyPrice: 100_000,
    };

    const result = applySell(existing, 1, 150_000);

    expect(result).toBeNull();
  });

  it("returns null when selling more than owned", () => {
    const existing: PortfolioPosition = {
      symbol: "BTC",
      quantity: 0.5,
      averageBuyPrice: 100_000,
    };

    const result = applySell(existing, 1, 150_000);

    expect(result).toBeNull();
  });
});

describe("calculateUnrealizedPnl", () => {
  it("calculates profit correctly", () => {
    const position: PortfolioPosition = {
      symbol: "BTC",
      quantity: 1,
      averageBuyPrice: 100_000,
    };

    const result = calculateUnrealizedPnl(position, 150_000);

    expect(result.marketValue).toBe(150_000);
    expect(result.costBasis).toBe(100_000);
    expect(result.pnl).toBe(50_000);
    expect(result.pnlPercent).toBeCloseTo(50);
  });

  it("calculates loss correctly", () => {
    const position: PortfolioPosition = {
      symbol: "ETH",
      quantity: 10,
      averageBuyPrice: 3_000,
    };

    const result = calculateUnrealizedPnl(position, 2_000);

    expect(result.marketValue).toBe(20_000);
    expect(result.costBasis).toBe(30_000);
    expect(result.pnl).toBe(-10_000);
    expect(result.pnlPercent).toBeCloseTo(-33.33, 1);
  });

  it("returns 0% when cost basis is zero", () => {
    const position: PortfolioPosition = {
      symbol: "FREE",
      quantity: 1,
      averageBuyPrice: 0,
    };

    const result = calculateUnrealizedPnl(position, 100);

    expect(result.pnlPercent).toBe(0);
  });
});
