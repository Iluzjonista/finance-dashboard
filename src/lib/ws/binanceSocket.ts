export class BinanceSocket {
  private readonly symbols: string[];

  constructor(symbols: string[]) {
    this.symbols = symbols;
  }
}