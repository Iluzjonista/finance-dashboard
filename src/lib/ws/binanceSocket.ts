import type { PriceTick } from "@/types/instruments";

const BINANCE_WS_URL = "wss://stream.binance.com:9443/stream";

type TickListener = (tick: PriceTick) => void;

export class BinanceSocket {
  private socket: WebSocket | null = null;
  private readonly listeners = new Set<TickListener>();

  constructor(private readonly symbols: string[]) {
    console.log("[BinanceSocket] created", {
      symbols: this.symbols,
    });
  }

  connect(): void {
    const streams = this.symbols
      .map((symbol) => `${symbol.toLowerCase()}@ticker`)
      .join("/");

    const url = `${BINANCE_WS_URL}?streams=${streams}`;

    console.log("[BinanceSocket] connecting", {
      url,
      streams,
    });

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("[BinanceSocket] connected");
    };

    this.socket.onmessage = (event: MessageEvent<string>) => {
      console.log("[BinanceSocket] message received", event.data);
    };
    
    this.socket.onerror = (error) => {
      console.error("[BinanceSocket] error", error);
    };

    this.socket.onclose = (event) => {
      console.log("[BinanceSocket] closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    };
  }

  disconnect(): void {
    console.log("[BinanceSocket] disconnecting");
    this.socket?.close();
    this.socket = null;
  }

  subscribe(listener: TickListener): () => void {
    this.listeners.add(listener);

    console.log("[BinanceSocket] listener subscribed", {
      listenersCount: this.listeners.size,
    });

    return () => {
      this.listeners.delete(listener);

      console.log("[BinanceSocket] listener unsubscribed", {
        listenersCount: this.listeners.size,
      });
    };
  }
}
