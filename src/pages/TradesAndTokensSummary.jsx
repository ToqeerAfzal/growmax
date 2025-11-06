import React, { useEffect, useState } from 'react';

const TradesAndTokensSummary = () => {
  const [trades, setTrades] = useState([]);
  const [tokensSummary, setTokensSummary] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    try {
      const res = await fetch('http://47.128.251.90:6070/api/trades');
      if (!res.ok) throw new Error('Failed to fetch trades');
      const data = await res.json();
      setTrades(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTrades(false);
    }
  };

  const fetchTokenSummary = async () => {
    try {
      const res = await fetch('http://47.128.251.90:6070/api/token-summary');
      if (!res.ok) throw new Error('Failed to fetch token summary');
      const data = await res.json();
      setTokensSummary(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    fetchTokenSummary();

    // Optional: Auto-refresh trades every 10 seconds for live updates
    const interval = setInterval(fetchTrades, 10000);
    return () => clearInterval(interval);
  }, []);

  const SideBadge = ({ side }) => (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full border ${
        side === 'Long'
          ? 'text-green-600 bg-green-50 border-green-200'
          : 'text-red-500 bg-red-50 border-red-200'
      }`}
    >
      {side}
    </span>
  );

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Closed Trades Feed */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Closed Trades Feed</h2>
            <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
              See All
            </a>
          </div>

          {loadingTrades ? (
            <p className="text-gray-500 text-sm">Loading trades...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">Error: {error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="text-left py-3">Time</th>
                    <th className="text-left py-3">Pair</th>
                    <th className="text-left py-3">Price</th>
                    <th className="text-left py-3">Side</th>
                    <th className="text-left py-3">Realized PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.length > 0 ? (
                    trades.map((trade, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="py-3">
                          {trade.time || trade.timestamp || '-'}
                        </td>
                        <td>{trade.pair || trade.symbol || '-'}</td>
                        <td>
                          {trade.price
                            ? `$${Number(trade.price).toLocaleString()}`
                            : '-'}
                        </td>
                        <td>
                          <SideBadge side={trade.side || 'N/A'} />
                        </td>
                        <td className="font-medium">
                          {trade.pnl ? `$${trade.pnl}` : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-400">
                        No trade data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tokens Summary */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tokens Summary</h2>
            <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
              See All
            </a>
          </div>

          {loadingTokens ? (
            <p className="text-gray-500 text-sm">Loading tokens summary...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">Error: {error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="text-left py-3">Tokens</th>
                    <th className="text-left py-3">Trades</th>
                    <th className="text-left py-3">Profit (24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {tokensSummary.length > 0 ? (
                    tokensSummary.map((token, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="py-3">{token.token}</td>
                        <td>{token.trades}</td>
                        <td className="font-medium">
                          ${token.profit24h?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-400">
                        No token data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradesAndTokensSummary;
