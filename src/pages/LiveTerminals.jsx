import React, { useEffect, useState } from "react";
import CryptoDashboard from "./CryptoDashboard";
import TradesAndTokensSummary from "./TradesAndTokensSummary";
import BotStatus from "./BotStatus";

export default function LiveTerminals() {

  // ---- Mock ticker data ----
  const [tickerData, setTickerData] = useState([
    { symbol: "BTC/USDT", price: "68,500", change: "+0.8%", up: true },
    { symbol: "ETH/USDT", price: "3,210", change: "-0.3%", up: false },
    { symbol: "SOL/USDT", price: "185.4", change: "+2.5%", up: true },
  ]);

  // ---- Stats from API ----
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://47.128.251.90:6070/api/trades-status");
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
          setLastUpdated(new Date().toLocaleTimeString());
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const {
    totalTrades,
    profitLast24h,
    realizedProfit,
    maxDrawdownPercent,
    sharpeRatio,
  } = stats;

  return (
    <div className="bg-[#fffaf6] font-sans text-gray-900">
      <div className="w-full border-b bg-white px-4 py-2 flex flex-wrap justify-center gap-4 text-sm">
        {tickerData.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="font-semibold">{item.symbol}</span>
            <span>{item.price}</span>
            <span
              className={`${item.up ? "text-green-500" : "text-red-500"
                } flex items-center`}
            >
              {item.change} {item.up ? "↗" : "↘"}
            </span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <img
            src="https://dummyimage.com/30x30/ffa500/fff.png&text=G"
            alt="logo"
            className="w-8 h-8"
          />
          <span className="font-bold text-lg">GROWMAX</span>
        </div>

        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-black">
            Dashboard
          </a>
          <a href="#" className="text-orange-500 font-semibold">
            Live Terminal
          </a>
          <a href="#" className="hover:text-black">
            My Rewards
          </a>
          <a href="#" className="hover:text-black">
            Become a Partner ▾
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="https://dummyimage.com/32x32/ccc/fff.png&text=O"
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium hidden sm:block">Olivia Rhye</span>
          </div>
          <div className="text-xl">💼</div>
        </div>
      </header>

      {/* Main Section */}
      <main className="px-6 pt-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Live Terminals
              <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded">
                LIVE
              </span>
            </h1>
            <p className="text-gray-500 mt-1">Our bots do the trade for you</p>
          </div>

          <div className="text-sm text-gray-600 space-x-4">
            <span>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-medium">Connected</span>
            </span>
            <span>
              <strong>Last Update:</strong> {lastUpdated || "--:--"}
            </span>
            <span>
              <strong>Auto-refresh:</strong> (10s)
            </span>
          </div>
        </div>

        {/* Quick Status Cards */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Quick Status</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Trades */}
            <div className="border rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 text-yellow-500">
                📊 <span className="font-semibold">Total Trades</span>
              </div>
              <div className="text-3xl font-bold">{totalTrades}</div>
              <div className="text-green-500 text-sm">↑ 100%</div>
            </div>

            {/* Realized Profit (24h) */}
            <div className="border rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 text-yellow-500">
                💰 <span className="font-semibold">Realized PNL (24h)</span>
              </div>
              <div className="text-3xl font-bold">
                ${profitLast24h?.toLocaleString()}
              </div>
              <div className="text-green-500 text-sm">↑ +0.1%</div>
            </div>

            {/* Max Drawdown */}
            <div className="border rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 text-yellow-500">
                📉 <span className="font-semibold">Max Drawdown</span>
              </div>
              <div className="text-3xl font-bold text-red-700">
                {maxDrawdownPercent}
              </div>
              <div className="text-red-500 text-sm">↓ 0.1%</div>
            </div>

            {/* Sharpe Ratio */}
            <div className="border rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 text-yellow-500">
                ⚙️ <span className="font-semibold">Sharpe Ratio</span>
              </div>
              <div className="text-3xl font-bold">{sharpeRatio}</div>
              <div className="text-red-500 text-sm">↓ 0.1%</div>
            </div>
          </div>
        </div>
      </main>
      <CryptoDashboard />
      <TradesAndTokensSummary />
      <BotStatus />
    </div>
  );
}
