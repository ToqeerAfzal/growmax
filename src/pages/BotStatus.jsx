import React, { useEffect, useState } from 'react';
import { HeartPulse, Cpu, Zap, Server } from 'lucide-react';

const BotStatus = () => {
  const [stats, setStats] = useState([]);

  const generateRandomData = () => {
    const randomHeartbeat = `${Math.floor(Math.random() * 10) + 1}s ago`;
    const randomBots = `${Math.floor(Math.random() * 10) + 1}`;
    const randomLatency = `${(Math.random() * (5 - 1) + 1).toFixed(2)}ms`;
    const randomServer = `${(Math.random() * (99.9 - 90.5) + 90.5).toFixed(1)}%`;

    return [
      {
        icon: <HeartPulse className="text-orange-400 w-6 h-6" />,
        title: 'Heartbeat',
        value: randomHeartbeat,
        subtitle: 'Last ping received',
        status: 'Live',
        statusColor: 'green',
      },
      {
        icon: <Cpu className="text-orange-400 w-6 h-6" />,
        title: 'Active Bots',
        value: randomBots,
        subtitle: '+1 from yesterday',
        statusColor: 'green',
      },
      {
        icon: <Zap className="text-orange-400 w-6 h-6" />,
        title: 'Latency',
        value: randomLatency,
        subtitle: '-0.3ms improvement',
        statusColor: 'green',
      },
      {
        icon: <Server className="text-orange-400 w-6 h-6" />,
        title: 'Server',
        value: randomServer,
        subtitle: 'Last ping received',
        status: 'Online',
        statusColor: 'purple',
      },
    ];
  };

  useEffect(() => {
    setStats(generateRandomData());
    const interval = setInterval(() => {
      setStats(generateRandomData());
    }, 10000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-3xl shadow-sm border border-orange-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bot Status</h2>
          <button className="bg-orange-50 text-orange-500 font-medium px-4 py-2 rounded-xl hover:bg-orange-100 transition">
            Become a Partner
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between bg-white border border-orange-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-3 rounded-full">{item.icon}</div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                </div>
                {item.status && (
                  <span
                    className={`text-xs px-2 py-1 rounded-md border font-medium ${
                      item.statusColor === 'green'
                        ? 'text-green-600 border-green-200 bg-green-50'
                        : 'text-purple-600 border-purple-200 bg-purple-50'
                    }`}
                  >
                    {item.status}
                  </span>
                )}
              </div>

              <div>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500 mt-1">
                  <span
                    className={
                      item.statusColor === 'green' ? 'text-green-600' : 'text-gray-500'
                    }
                  >
                    {item.subtitle}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BotStatus;
