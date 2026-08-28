export type InstrumentType = 'crypto' | 'fiat';

export type TransactionSide = 'buy' | 'sell';

export interface Instrument {
  symbol: string;
  displayName: string;
  type: InstrumentType;
}

export interface PriceTick {
  symbol: string;
  price: number;
  changePercent?: number;
  timestamp: number;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  averageBuyPrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  side: TransactionSide;
  quantity: number;
  price: number;
  timestamp: number;
}