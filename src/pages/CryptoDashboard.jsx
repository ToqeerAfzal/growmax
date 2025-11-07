import React, { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";


const TOKEN_LIST = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "MATIC",
  "LINK",
  "TRX",
  "UNI",
  "AVAX",
  "LTC",
  "XLM",
  "AAVE",
  "TON",
  "ETC",
  "ATOM",
  "ALGO",
  "NEAR",
];

// Map UI timeframe label -> Binance interval
const INTERVAL_MAP = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  // Your design had 5h; Binance doesn't provide 5h. we'll use 4h which is closest.
  "5h": "4h",
  "1d": "1d",
};

function symbolToBinance(symbol) {
  // produce e.g. BTC -> BTCUSDT
  return `${symbol}USDT`;
}

export default function CryptoDashboard() {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const [selected, setSelected] = useState("BTC");
  const [intervalLabel, setIntervalLabel] = useState("1d");
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [buyPercent, setBuyPercent] = useState(45);
  const klineWsRef = useRef(null);
  const depthWsRef = useRef(null);

  // Fetch historical candles from Binance REST
  const fetchHistorical = async (symbol, interval) => {
    try {
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`;
      const res = await fetch(url);
      const data = await res.json();
      // Binance returns arrays: [ openTime, open, high, low, close, volume, ... ]
      return data.map((d) => ({
        time: Math.floor(d[0] / 1000),
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));
    } catch (err) {
      console.error("historical fetch error", err);
      return [];
    }
  };

  // Fetch orderbook snapshot
  const fetchOrderbookSnapshot = async (symbol) => {
    try {
      const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=50`;
      const res = await fetch(url);
      const data = await res.json();
      return {
        bids: data.bids.map((b) => ({ price: parseFloat(b[0]), qty: parseFloat(b[1]) })),
        asks: data.asks.map((a) => ({ price: parseFloat(a[0]), qty: parseFloat(a[1]) })),
      };
    } catch (err) {
      console.error("orderbook snapshot error", err);
      return { bids: [], asks: [] };
    }
  };

  useEffect(() => {
    // create chart once
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 560,
      layout: {
        background: { type: "solid", color: "#ffffff" },
        textColor: "#222",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: true },
      },
      rightPriceScale: { visible: true, borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#2ecc71",
      downColor: "#e74c3c",
      borderVisible: false,
      wickUpColor: "#2ecc71",
      wickDownColor: "#e74c3c",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // whenever selected or interval changes, re-load historical and re-subscribe sockets
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;

    const binSymbol = symbolToBinance(selected);
    const interval = INTERVAL_MAP[intervalLabel] || "1d";

    let mounted = true;

    (async () => {
      const candles = await fetchHistorical(binSymbol, interval);
      if (!mounted) return;
      candleSeriesRef.current.setData(candles);

      // cleanup previous websockets
      if (klineWsRef.current) {
        klineWsRef.current.close();
        klineWsRef.current = null;
      }
      if (depthWsRef.current) {
        depthWsRef.current.close();
        depthWsRef.current = null;
      }

      // subscribe to kline updates
      const klineStream = `${binSymbol.toLowerCase()}@kline_${interval}`;
      const klineWs = new WebSocket(`wss://stream.binance.com:9443/ws/${klineStream}`);
      klineWs.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          const k = msg.k;
          const candle = {
            time: Math.floor(k.t / 1000),
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          // if k.x == true => finished candle
          if (k.x) {
            candleSeriesRef.current.update(candle);
          } else {
            // partial candle update
            candleSeriesRef.current.update(candle);
          }
        } catch (err) {
          console.error(err);
        }
      };
      klineWs.onopen = () => {/*console.log('kline ws open')*/ };
      klineWs.onerror = (e) => console.error('kline ws error', e);
      klineWsRef.current = klineWs;

      // orderbook snapshot + depth websocket for updates
      const snapshot = await fetchOrderbookSnapshot(binSymbol);
      if (!mounted) return;
      setOrderBook(snapshot);

      const depthStream = `${binSymbol.toLowerCase()}@depth@100ms`;
      const depthWs = new WebSocket(`wss://stream.binance.com:9443/ws/${depthStream}`);
      depthWs.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          // msg.b = bids, msg.a = asks -> each item [price, qty]
          const bids = (msg.b || []).map((b) => ({ price: parseFloat(b[0]), qty: parseFloat(b[1]) }));
          const asks = (msg.a || []).map((a) => ({ price: parseFloat(a[0]), qty: parseFloat(a[1]) }));

          // naive merge: replace prices present, otherwise keep snapshot values, then sort
          const mergedBids = mergeOrderbookSide(orderBook.bids, bids, "bids");
          const mergedAsks = mergeOrderbookSide(orderBook.asks, asks, "asks");

          setOrderBook({ bids: mergedBids.slice(0, 25), asks: mergedAsks.slice(0, 25) });
          computeBuySellPercent(mergedBids, mergedAsks);
        } catch (err) {
          console.error(err);
        }
      };
      depthWs.onerror = (e) => console.error('depth ws error', e);
      depthWsRef.current = depthWs;
    })();

    return () => {
      mounted = false;
      if (klineWsRef.current) {
        klineWsRef.current.close();
        klineWsRef.current = null;
      }
      if (depthWsRef.current) {
        depthWsRef.current.close();
        depthWsRef.current = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, intervalLabel]);

  // Helper to merge orderbook updates
  function mergeOrderbookSide(prev = [], updates = [], side = "bids") {
    // create map from prev
    const map = new Map(prev.map((p) => [p.price.toFixed(8), p.qty]));
    updates.forEach((u) => {
      const key = u.price.toFixed(8);
      if (u.qty === 0) {
        map.delete(key);
      } else {
        map.set(key, u.qty);
      }
    });
    const arr = Array.from(map.entries()).map(([price, qty]) => ({ price: parseFloat(price), qty }));
    if (side === "bids") {
      return arr.sort((a, b) => b.price - a.price);
    }
    return arr.sort((a, b) => a.price - b.price);
  }

  function computeBuySellPercent(bids = [], asks = []) {
    // sum top volumes
    const bidVol = bids.slice(0, 10).reduce((s, b) => s + b.qty, 0);
    const askVol = asks.slice(0, 10).reduce((s, a) => s + a.qty, 0);
    const total = bidVol + askVol || 1;
    const buy = Math.round((bidVol / total) * 100);
    setBuyPercent(buy);
  }

  // small utility to format prices nicely
  const fmt = (n) => n && n.toLocaleString(undefined, { maximumFractionDigits: 8 });

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left: chart panel */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="w-[70%]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="appearance-none px-4 py-2 bg-amber-50 rounded-lg font-semibold text-amber-600 pr-8 cursor-pointer focus:outline-none"
                  >
                    {TOKEN_LIST.map((t) => (
                      <option key={t} value={t}>
                        {t}/USDT
                      </option>
                    ))}
                  </select>
                  {/* dropdown arrow */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>                <div className="text-3xl font-extrabold">$3890</div>
                <div className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">+7.2%</div>
              </div>

              <div className="flex items-center gap-2">
                {Object.keys(INTERVAL_MAP).map((label) => (
                  <button
                    key={label}
                    onClick={() => setIntervalLabel(label)}
                    className={`px-3 py-1 rounded-lg border ${intervalLabel === label ? 'bg-amber-400 text-white' : 'bg-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex">
              <div className="w-12 flex flex-col gap-3 pt-6">
                {/* left vertical tool icons (placeholder) */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-100 rounded-md" />
                ))}
              </div>

              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <div ref={chartContainerRef} style={{ width: '100%', height: 520 }} />
              </div>
            </div>
          </div>

          {/* Right: orderbook */}
          <div className="w-96 bg-white rounded-xl border p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Order Book</h3>
              <div className="text-sm text-amber-500">{selected}</div>
            </div>

            <div className="flex text-xs text-gray-500 border-b pb-2">
              <div className="w-1/3">Price (USDT)</div>
              <div className="w-1/3 text-center">Amount ({selected})</div>
              <div className="w-1/3 text-right">Total</div>
            </div>

            <div className="flex-1 overflow-auto mt-2">
              {/* asks (sell) shown first in red */}
              {orderBook.asks.slice(0, 5).map((a, i) => (
                <div key={`ask-${i}`} className="flex items-center text-sm py-2 border-b">
                  <div className="w-1/3 text-red-500">{fmt(a.price)}</div>
                  <div className="w-1/3 text-center">{fmt(a.qty)}</div>
                  <div className="w-1/3 text-right">{fmt(a.price * a.qty)}</div>
                </div>
              ))}

              {/* divider showing mid price */}
              <div className="py-2 text-center text-sm font-medium">{selected}/USDT</div>

              {/* bids (buy) shown in green */}
              {orderBook.bids.slice(0, 5).map((b, i) => (
                <div key={`bid-${i}`} className="flex items-center text-sm py-2 border-b">
                  <div className="w-1/3 text-green-600">{fmt(b.price)}</div>
                  <div className="w-1/3 text-center">{fmt(b.qty)}</div>
                  <div className="w-1/3 text-right">{fmt(b.price * b.qty)}</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${buyPercent}%`, background: 'linear-gradient(90deg,#22c55e,#16a34a)' }} />
                <div style={{ width: `${100 - buyPercent}%`, display: 'none' }} />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <div className="text-green-700">Buy: {buyPercent}%</div>
                <div className="text-red-600">Sell: {100 - buyPercent}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
