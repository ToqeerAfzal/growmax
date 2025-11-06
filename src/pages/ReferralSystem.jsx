
import { useEffect, useState } from 'react';
import config from "../../config/config.json";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/NavBar';
import {
  Share2,
  Copy,
  Users,
  DollarSign,
  TrendingUp,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  ExternalLink,
  MessageCircleMore
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userServices } from '../../Services/userServices';
import { plateformServices } from '../../Services/plateformServices';

const ReferralSystem = () => {
  const [totalReferral, setTotalReferral] = useState(0);
  const [totalReferralEarn, setTotalReferralEarn] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [levelRewards, setLevelRewards] = useState([]);
  const [referralLink, setReferralLink] = useState(`https://growmaxglobal.com/ref/${referralCode}`);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getCurrectLoginUser = async () => {
    let data = await userServices.getCurrectLoginUser()
    setReferralCode(data?.referralCode)
    setReferralLink(`${config.baseURL}/signup/${data?.referralCode}`)
  }

  const getReferralUsers = async () => {
    let data = await plateformServices.getReferralUsers()
    setRecentReferrals(data?.data || [])
    setTotalReferralEarn(data?.earn || 0)
  }

  const getUserData = async () => {
    let data = await userServices.getUserData()
    setTotalReferral((data?.data || [])?.length)
  }

  const getLevelWiseEarning = async () => {
    let data = await plateformServices.getLevelWiseEarning()
    setLevelRewards(data?.data || [])
  }

  useEffect(() => {
    getUserData()
    getReferralUsers()
    getCurrectLoginUser();
    getLevelWiseEarning()
  }, []);

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

  const stats = [
    { label: 'Total Referrals', value: totalReferral, icon: Users, color: 'text-blue-400' },
    { label: 'Active This Month', value: totalReferral, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Earnings', value: totalReferralEarn, icon: DollarSign, color: 'text-primary' },
    { label: 'This Month', value: totalReferralEarn, icon: TrendingUp, color: 'text-green-400' }
  ];

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const shareVia = (platform) => {
    const text = "Join me on GrowmaxGlobal and start earning passive income through crypto staking!";
    const url = referralLink;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Join GrowmaxGlobal')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

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
              animationDuration: "2s",
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl"></div>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">Referral System</h1>
          <p className="text-gray-400 mt-1">Earn passive income by referring new users</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="feature-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Referral Links & Sharing */}
          <div className="space-y-6">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="text-white">Your Referral Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Referral Code</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={referralCode}
                      readOnly
                      className="bg-black/20 border-gray-600 text-white"
                    />
                    <Button
                      onClick={() => copyToClipboard(referralCode, 'Referral code')}
                      size="sm"
                      className="btn-gold"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Referral Link</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="bg-black/20 border-gray-600 text-white text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(referralLink, 'Referral link')}
                      size="sm"
                      className="btn-gold"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-3 text-gray-300">Share via:</h4>
                  <div className="flex gap-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareVia('email')}
                        className="aspect-square hover:text-white hover:bg-gray-700"
                      >
                        <MessageCircleMore className="h-5 w-5" />
                      </Button>
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://telegram.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("CoinStake")}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="aspect-square hover:text-white hover:bg-gray-700"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Bonuss */}
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Level-wise Earnings</CardTitle>
                <Link to="/teams">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    See All
                  </Button>
                </Link>
              </CardHeader>
              {levelRewards?.length > 0 ? (
                <CardContent>
                  <div>
                    {(levelRewards || [])?.reverse().slice(0, 5)?.map((level, index) => (
                      <div key={index} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-b-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Level {level.level} ({level.percentage}%)</p>
                          <p className="text-xs text-gray-400">{level.count} deposits</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${level.earnings.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : (
                <div className="flex justify-center">No record found.</div>
              )}
            </Card>
          </div>

          {/* Recent Referrals */}
          <div className="space-y-6">
            <Card className="feature-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Recent Referrals</CardTitle>
                <Link to="/teams">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    See All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentReferrals?.length > 0 ?
                  <div className="space-y-4">
                    {recentReferrals?.reverse().slice(0, 5)?.map((referral, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{referral.firstName || ""} {referral.lastName || ""}</p>
                            <p className="text-xs text-gray-400">{referral.email}</p>
                            <p className="text-xs text-gray-400">{referral.joinDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* <p className={`text-xs font-medium ${referral.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                            {referral.status}
                          </p> */}
                          {/* <p className="text-sm font-bold text-primary">
                          ${referral.earned.toFixed(2)}
                        </p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                  :
                  <div className='flex justify-center'>No record found.</div>
                }
              </CardContent>
            </Card>

            {/* Referral Program Info */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="text-white">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-black font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Share Your Link</p>
                      <p className="text-xs text-gray-400">Send your referral link to friends and family</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-black font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">They Join & Stake</p>
                      <p className="text-xs text-gray-400">Your referrals sign up and start staking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
