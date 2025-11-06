import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const faqs = [
  {
    q: "How does Growmax Global generate returns?",
    a: "Returns are generated through real trading strategies — including algorithmic and manual trading across Bybit, Binance, and OKX. This ensures sustainable, real-market backed earnings.",
  },
  {
    q: "What is the minimum amount to start staking?",
    a: "The minimum stake is $100 USDT (BEP-20).",
  },
  {
    q: "How often are rewards credited?",
    a: "Rewards are credited daily directly to your dashboard wallet in USDT.",
  },
  {
    q: "Can I withdraw my ROI daily?",
    a: "Yes, daily ROI payouts are withdrawable at any time.",
  },
  {
    q: "What happens after my plan reaches 2×?",
    a: "Once your plan delivers 2× the staked amount (capital + ROI), it completes. You may manually choose to restake if you wish to continue.",
  },
  {
    q: "How can I increase my earnings?",
    a: "You can increase your stake amount or choose to manually restake your earned rewards after plan completion.",
  },
  {
    q: "Are referrals mandatory?",
    a: "No, referrals are optional. However, referring others helps you earn additional team bonuses.",
  },
  {
    q: "How is security ensured?",
    a: "We use audited smart contracts, real-time dashboards, and no native tokens to ensure transparency and user fund safety.",
  },
  {
    q: "How long does it take to process withdrawals?",
    a: "Withdrawals are processed within 24 hours.",
  },
  {
    q: "Are there penalties for early exit?",
    a: "Yes, an early exit before 2× completion incurs a 20% deduction plus a service fee.",
  },
  {
    q: "Can I have multiple staking plans?",
    a: "Yes, you can stake multiple amounts at the same time. Each plan is tracked separately.",
  },
  {
    q: "Are earnings affected by market volatility?",
    a: "No. Your returns are based on daily ROI as promised by Growmax Global, backed by trading profits, not direct market fluctuations.",
  },
  {
    q: "Is KYC required?",
    a: "Currently, no KYC is required. Simply connect your wallet and start staking.",
  },
  {
    q: "Can I track my earnings in real time?",
    a: "Yes, your dashboard shows live earnings, referrals, and plan status.",
  },
  {
    q: "Are there hidden fees?",
    a: "No hidden fees. All deductions are transparently communicated (e.g., early exit penalties).",
  },
  {
    q: "Do referrals contribute to my 2× cap?",
    a: "No. Referral income is separate and does not count toward your 2× staking plan cap.",
  },
  {
    q: "Can I stake from any wallet?",
    a: "Yes, any BEP-20 compatible wallet (e.g., Trust Wallet, MetaMask) can be used.",
  },
  {
    q: "What if I lose access to my wallet?",
    a: "Please ensure you securely back up your wallet. Growmax Global cannot recover lost wallets.",
  },
  {
    q: "Is there a mobile app?",
    a: "A web app is fully mobile-optimized. A native app may be launched in the future.",
  },
  {
    q: "What trading strategies are used?",
    a: "We use momentum, volatility, market rotation, and risk-adjusted allocation strategies.",
  },
  {
    q: "How do I restake?",
    a: "Once your plan completes, you can manually stake again through your dashboard.",
  },
  {
    q: "Is there compounding?",
    a: "You can manually choose to restake your ROI to compound your capital.",
  },
  {
    q: "Can I upgrade my plan during staking?",
    a: "You can open new plans anytime. Existing plans remain unaffected.",
  },
  {
    q: "How are referral commissions paid?",
    a: "Referral bonuses are paid daily in USDT (BEP-20).",
  },
  {
    q: "How deep does the referral system go?",
    a: "18 levels deep with dynamic team rewards.",
  },
  {
    q: "Are team bonuses separate from ROI?",
    a: "Yes, they are in addition to your staking ROI.",
  },
  {
    q: "Can I see my full team structure?",
    a: "Yes, the dashboard provides a tree view of your team.",
  },
  {
    q: "Are funds pooled?",
    a: "Funds are managed collectively for trading but plans and earnings are individually tracked.",
  },
  {
    q: "How is sustainability ensured?",
    a: "ROI is generated from real trading profits, not from new user deposits.",
  },
  {
    q: "Can I contact support easily?",
    a: "Yes. 24/7 support via Telegram, email, and live chat.",
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Generate random stars
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      });
    }
    return stars;
  };

  const stars = generateStars();
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-foreground relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: '2s',
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl"></div>
      <Header />
      <div className="pt-32 max-w-4xl mx-auto px-4 py-10 text-gray-300">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#F9DB9A]">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-xl bg-gray-800 transition-shadow hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-5 py-4 flex justify-between items-center"
              >
                <span className="text-lg">
                  {index + 1}. {item.q}
                </span>
                {/* <span className="text-[#F9DB9A] text-xl">
                  {openIndex === index ? "-" : "+"}
                </span> */}
              </button>
              {/* {openIndex === index && ( */}
                <div className="px-5 pb-4 text-sm text-gray-400">{item.a}</div>
              {/* )} */}
            </div>
          ))}
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default FaqPage;
