import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, ChevronRight, Star, Lock, Zap, ChartBar, Search } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { packageServices } from '../../Services/packageServices';


const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [packages, setPackages] = useState([]);

  const getPackageDataNoAuth = async () => {
    const data = await packageServices.getPackageDataNoAuth();
    setPackages(data?.data || []);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getPackageDataNoAuth();
  }, []);

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
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl"></div>

      <style jsx>{`
        .gradient-gold-text {
          background: linear-gradient(135deg, #F9DB9A 0%, #F67300 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-gold {
          background: linear-gradient(135deg, #F9DB9A 0%, #F67300 100%);
          color: #0a0a0a;
          font-weight: 600;
          {/* padding: 1rem 2rem; */}
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(246, 115, 0, 0.3);
          border: none;
        }
        .btn-gold:hover {
          box-shadow: 0 8px 30px rgba(246, 115, 0, 0.5);
          transform: translateY(-3px);
          color: #0a0a0a;
        }
        .btn-outline {
          border: 2px solid rgba(249, 219, 154, 0.8);
          color: #F9DB9A;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          font-weight: 600;
          {/* padding: 1rem 2rem; */}
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }
        .btn-outline:hover {
          background: linear-gradient(135deg, #F9DB9A 0%, #F67300 100%);
          color: #0a0a0a;
          border-color: transparent;
          box-shadow: 0 4px 20px rgba(246, 115, 0, 0.3);
        }
        {/* .feature-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(249, 219, 154, 0.2);
          border-radius: 1rem;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          border-color: rgba(249, 219, 154, 0.4);
          box-shadow: 0 10px 40px rgba(249, 219, 154, 0.1);
          transform: translateY(-5px);
        } */}
        .stat-card {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
        }
      `}</style>

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 relative z-10">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-white">Stake with </span>
              <span className="gradient-gold-text">Confidence,</span><br />
              <span className="text-white">Earn with </span>
              <span className="gradient-gold-text">Clarity</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Growmax Global is a transparent, USDT-based staking platform backed by a real trading engine. Experience daily fixed returns, zero token risk, and scalable community growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup">
                <button className="btn-gold text-lg px-10 py-4">
                  Get Started
                  <ChevronRight className="ml-2 h-6 w-6 inline" />
                </button>
              </Link>
              <Link to="/admin/login">
                <button className="btn-outline text-lg px-10 py-4">
                  Team Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2.4M</div>
              <div className="text-gray-400 text-sm mb-2">Total Value Locked</div>
              <div className="text-green-400 text-sm font-semibold">+52.0%</div>
            </div>
            <div className="stat-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">12,847</div>
              <div className="text-gray-400 text-sm mb-2">Active Stakers</div>
              <div className="text-green-400 text-sm font-semibold">+23%</div>
            </div>
            <div className="stat-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">$340K</div>
              <div className="text-gray-400 text-sm mb-2">Rewards Distributed</div>
              <div className="text-green-400 text-sm font-semibold">+30.0%</div>
            </div>
            <div className="stat-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400 text-sm mb-2">Security Rating</div>
              <div className="text-green-400 text-sm font-semibold">+6%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              What Makes <span className="gradient-gold-text">GrowmaxGlobal</span> Better?
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the perfect blend of high yields, security, and innovation
              in our next-generation staking platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Stability</h3>
              </div>
              {/* <p className="text-gray-300 mb-6 leading-relaxed">
                Earn up to 24% APY with our optimized staking algorithms 
                and smart contract technology.
              </p> */}
              <ul className="space-y-3">
                <li className="flex text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  100% USDT staking — no native token volatility
                </li>
                <li className="flex text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  BEP-20 stable asset ensures consistent value
                </li>
                <li className="flex text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  No exposure to market crashes or token manipulation
                </li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChartBar className="h-8 w-8 text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Real Trading-Backed ROI </h3>
              </div>
              {/* <p className="text-gray-300 mb-6 leading-relaxed">
                Your assets are protected by multi-layer security 
                protocols and insurance coverage.
              </p> */}
              <ul className="space-y-3">
                <li className="flex items-start text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  ROI powered by bot, algorithmic, and manual trading
                </li>
                <li className="flex items-start text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  Active on Bybit, Binance, OKX, and BingX
                </li>
                <li className="flex items-start text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  No dependence on new user deposits
                </li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Transparency & Security</h3>
              </div>
              {/* <p className="text-gray-300 mb-6 leading-relaxed">
                Build your passive income through our 10-level system 
                with unlimited earning potential.
              </p> */}
              <ul className="space-y-3">
                <li className="flex items-start text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  Audited smart contracts ensure protocol integrity
                </li>
                <li className="flex items-start text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  Real-time performance dashboard
                </li>
                <li className="flex items-start text-sm gradient-gold-text">
                  <Star className="h-4 w-4 mr-3" />
                  Early exit deductions protect sustainability and fairness
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="gradient-gold-text">Staking</span> Packages
            </h2>
            <p className="text-xl text-gray-300">
              Choose the perfect package for your investment goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages?.map((pkg) => (
              <div key={pkg._id} className="feature-card relative">
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-400 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-3xl font-bold text-white mb-2 text-center">{pkg.packageName}</h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold gradient-gold-text mb-2">{pkg.reward}% APY</div>
                  <div className="text-gray-400">${pkg.minAmount.toLocaleString()} - ${pkg.maxAmount.toLocaleString()}</div>
                </div>
                <ul className="space-y-2 mb-3">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                      {pkg.description}
                    </pre>
                  </div>
                </ul>
                <Link to="/signup" className="block">
                  <button className="btn-outline w-full py-3">Get Started</button>
                </Link>
              </div>
            ))}

            {/* <div className="feature-card p-8 relative border-2 border-orange-500/50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 text-center">Silver</h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold gradient-gold-text mb-2">21% APY</div>
                <div className="text-gray-400">$1,000 - $4,999</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  Daily rewards
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  8-level referrals
                </li>
              </ul>
              <Link to="/signup" className="block">
                <button className="btn-gold w-full py-3">Get Started</button>
              </Link>
            </div>

            <div className="feature-card p-8 relative">
              <h3 className="text-3xl font-bold text-white mb-2 text-center">Gold</h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold gradient-gold-text mb-2">24% APY</div>
                <div className="text-gray-400">$5,000+</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  Daily rewards
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  VIP support
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  Personal manager
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  10-level referrals
                </li>
                <li className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 gradient-gold-text mr-3" />
                  Exclusive events
                </li>
              </ul>
              <Link to="/signup" className="block">
                <button className="btn-outline w-full py-3">Get Started</button>
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Start <span className="gradient-gold-text">Earning</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              No technical experience required. Stake in minutes and earn daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <button className="btn-gold text-lg px-10 py-4">
                  Get Started Now
                  <ChevronRight className="ml-2 h-6 w-6 inline" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
