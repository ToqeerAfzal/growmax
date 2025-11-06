import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  ArrowUp,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  Copy,
  ChevronDown,
  ExternalLink,
  BarChart3,
  Database,
  Wallet,
  DollarSign,
  EyeOff,
  Eye
} from 'lucide-react';
import { plateformServices } from '../../Services/plateformServices';

const RewardHistoryList = () => {
  const [earning, setEarning] = useState({})
  const [earningVisible, setEarningVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('All Time');

  const [currentWPage, setCurrentWPage] = useState(1);
  const [searchWTerm, setSearchWTerm] = useState('');
  const [dateWRange, setDateWRange] = useState('All Time');

  const [currentW1Page, setCurrentW1Page] = useState(1);
  const [searchW1Term, setSearchW1Term] = useState('');
  const [dateW1Range, setDateW1Range] = useState('All Time');

  const [currentW2Page, setCurrentW2Page] = useState(1);
  const [searchW2Term, setSearchW2Term] = useState('');
  const [dateW2Range, setDateW2Range] = useState('All Time');

  const [currentW3Page, setCurrentW3Page] = useState(1);
  const [searchW3Term, setSearchW3Term] = useState('');
  const [dateW3Range, setDateW3Range] = useState('All Time');

  const [currentW4Page, setCurrentW4Page] = useState(1);
  const [searchW4Term, setSearchW4Term] = useState('');
  const [dateW4Range, setDateW4Range] = useState('All Time');

  const [allTransactions, setAllTransactions] = useState([]);
  const [allWTransactions, setAllWTransactions] = useState([]);
  const [allW1Transactions, setAllW1Transactions] = useState([]);
  const [allW2Transactions, setAllW2Transactions] = useState([]);
  const [allW3Transactions, setAllW3Transactions] = useState([]);
  const [allW4Transactions, setAllW4Transactions] = useState([]);
  const itemsPerPage = 10;

  const getUserDashboardRewardEarning = async () => {
    let data = await plateformServices.getUserDashboardRewardEarning();
    setEarning(data);
  };

  const [totalSelfRewardLoader, setTotalSelfRewardLoader] = useState(false);
  const [selfRewardLoader, setSelfRewardLoader] = useState(false);
  const getTotalSelfRewardHistory = async () => {
    setTotalSelfRewardLoader(true)
    let data = await plateformServices.getDailyRewardHistory("self")
    setAllTransactions(data?.data || [])
    setTotalSelfRewardLoader(false)
  }

  const getSelfRewardHistory = async () => {
    setSelfRewardLoader(true)
    let data = await plateformServices.getSelfRewardHistory()
    setAllW4Transactions(data?.data || [])
    setSelfRewardLoader(false)
  }

  const [referralHistoryLoader, setReferralHistoryLoader] = useState(false);
  const getTotalReferralHistory = async () => {
    setReferralHistoryLoader(true)
    let data = await plateformServices.getTotalReferralHistory()
    setAllWTransactions(data?.data || [])
    setReferralHistoryLoader(false)
  }

  const [totalLevelLoader, setTotalLevelLoader] = useState(false);
  const getTotalLevelHistory = async () => {
    setTotalLevelLoader(true)
    let data = await plateformServices.getDailyRewardHistory("level")
    setAllW1Transactions(data?.data || [])
    setTotalLevelLoader(false)
  }

  const [totalRankLoader, setTotalRankLoader] = useState(false);
  const getTotalRankHistory = async () => {
    setTotalRankLoader(true)
    let data = await plateformServices.getDailyRewardHistory("rank")
    setAllW3Transactions(data?.data || [])
    setTotalRankLoader(false)
  }

  const [totalDailyfRewardLoader, setTotalDailyfRewardLoader] = useState(false);
  const getDailyRewardHistory = async () => {
    setTotalDailyfRewardLoader(true)
    let data = await plateformServices.getDailyRewardHistory("all")
    setAllW2Transactions(data?.data || [])
    setTotalDailyfRewardLoader(false)
  }

  useEffect(() => {
    getTotalReferralHistory();
    getTotalLevelHistory()
    getTotalRankHistory()
    getTotalSelfRewardHistory()
    getDailyRewardHistory()
    getSelfRewardHistory()
    getUserDashboardRewardEarning()
  }, []);

  const filteredTransactions = Array.isArray(allTransactions)
    ? allTransactions.filter(tx => {
      const matchesSearch = searchTerm === '' ||
        tx.id?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        (tx.package && tx.package.toLowerCase().includes(searchTerm?.toLowerCase()));
      const now = new Date();
      const txDate = new Date(tx.createdAt);
      now.setHours(23, 59, 59, 999);
      let matchesDate = true;
      if (dateRange === 'Last 7 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 6);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 30 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 29);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 90 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 89);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else {
        matchesDate = true;
      }

      return matchesSearch && matchesDate;
    })
    : [];


  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions?.slice(startIndex, endIndex);

  const filteredWTransactions = Array.isArray(allWTransactions)
    ? allWTransactions.filter(tx => {
      const matchesSearch = searchWTerm === '' ||
        tx.id?.toLowerCase().includes(searchWTerm?.toLowerCase()) ||
        tx.amount?.toLowerCase().includes(searchWTerm?.toLowerCase())
      const now = new Date();
      const txDate = new Date(tx.createdAt);
      now.setHours(23, 59, 59, 999);
      let matchesDate = true;
      if (dateRange === 'Last 7 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 6);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 30 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 29);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 90 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 89);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else {
        matchesDate = true;
      }

      return matchesSearch && matchesDate;
    })
    : [];

  const totalWPages = Math.ceil(filteredWTransactions?.length / itemsPerPage);
  const startWIndex = (currentWPage - 1) * itemsPerPage;
  const endWIndex = startWIndex + itemsPerPage;
  const currentWTransactions = filteredWTransactions?.slice(startWIndex, endWIndex);

  const filteredW1Transactions = Array.isArray(allW1Transactions)
    ? allW1Transactions.filter(tx => {
      const matchesSearch = searchW1Term === '' ||
        tx.id?.toLowerCase().includes(searchW1Term?.toLowerCase()) ||
        tx.amount?.toLowerCase().includes(searchW1Term?.toLowerCase())
      const now = new Date();
      const txDate = new Date(tx.createdAt);
      now.setHours(23, 59, 59, 999);
      let matchesDate = true;
      if (dateRange === 'Last 7 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 6);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 30 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 29);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 90 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 89);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else {
        matchesDate = true;
      }

      return matchesSearch && matchesDate;
    })
    : [];

  const totalW1Pages = Math.ceil(filteredW1Transactions?.length / itemsPerPage);
  const startW1Index = (currentW1Page - 1) * itemsPerPage;
  const endW1Index = startW1Index + itemsPerPage;
  const currentW1Transactions = filteredW1Transactions?.slice(startW1Index, endW1Index);

  const filteredW2Transactions = Array.isArray(allW2Transactions)
    ? allW2Transactions.filter(tx => {
      const matchesSearch = searchW2Term === '' ||
        tx.id?.toLowerCase().includes(searchW2Term?.toLowerCase()) ||
        tx.amount?.toLowerCase().includes(searchW2Term?.toLowerCase())
      const now = new Date();
      const txDate = new Date(tx.createdAt);
      now.setHours(23, 59, 59, 999);
      let matchesDate = true;
      if (dateRange === 'Last 7 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 6);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 30 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 29);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 90 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 89);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else {
        matchesDate = true;
      }

      return matchesSearch && matchesDate;
    })
    : [];

  const totalW2Pages = Math.ceil(filteredW2Transactions?.length / itemsPerPage);
  const startW2Index = (currentW2Page - 1) * itemsPerPage;
  const endW2Index = startW2Index + itemsPerPage;
  const currentW2Transactions = filteredW2Transactions?.slice(startW2Index, endW2Index);

  const filteredW3Transactions = Array.isArray(allW3Transactions)
    ? allW3Transactions.filter(tx => {
      const matchesSearch = searchW3Term === '' ||
        tx.id?.toLowerCase().includes(searchW3Term?.toLowerCase()) ||
        tx.amount?.toLowerCase().includes(searchW3Term?.toLowerCase())
      const now = new Date();
      const txDate = new Date(tx.createdAt); // convert '12-07-2025' to Date

      now.setHours(23, 59, 59, 999);
      let matchesDate = true;
      if (dateRange === 'Last 7 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 6);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 30 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 29);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 90 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 89);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else {
        matchesDate = true;
      }

      return matchesSearch && matchesDate;
    })
    : [];

  const totalW3Pages = Math.ceil(filteredW3Transactions?.length / itemsPerPage);
  const startW3Index = (currentW3Page - 1) * itemsPerPage;
  const endW3Index = startW3Index + itemsPerPage;
  const currentW3Transactions = filteredW3Transactions?.slice(startW3Index, endW3Index);

  const filteredW4Transactions = Array.isArray(allW4Transactions)
    ? allW4Transactions.filter(tx => {
      const matchesSearch = searchW4Term === '' ||
        tx.id?.toLowerCase().includes(searchW4Term?.toLowerCase()) ||
        tx.packageName?.toLowerCase().includes(searchW4Term?.toLowerCase()) ||
        tx.amount?.toLowerCase().includes(searchW4Term?.toLowerCase())
      const now = new Date();
      const txDate = new Date(tx.createdAt); // convert '12-07-2025' to Date

      now.setHours(23, 59, 59, 999);
      let matchesDate = true;
      if (dateRange === 'Last 7 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 6);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 30 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 29);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else if (dateRange === 'Last 90 days') {
        const daysAgo = new Date();
        daysAgo.setDate(now.getDate() - 89);
        daysAgo.setHours(0, 0, 0, 0);
        matchesDate = txDate >= daysAgo && txDate <= now;
      } else {
        matchesDate = true;
      }

      return matchesSearch && matchesDate;
    })
    : [];


  const totalW4Pages = Math.ceil(filteredW4Transactions?.length / itemsPerPage);
  const startW4Index = (currentW4Page - 1) * itemsPerPage;
  const endW4Index = startW4Index + itemsPerPage;
  const currentW4Transactions = filteredW4Transactions?.slice(startW4Index, endW4Index);

  const [openReward, setOpenReward] = useState("selfPackage");
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

  const statsSelfReward = [
    {
      title: "Today Earning",
      amount: `$ ${earning?.selfReward?.today || 0}`,
      icon: <DollarSign className="h-8 w-8 text-blue-400" />,
      percentage: `${earning?.selfReward?.todayVsYesterdayPercentage || 0}%`,
      percentageColor: String(earning?.selfReward?.todayVsYesterdayPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-blue-400",
    },
    {
      title: "Last 7 Days Earning",
      amount: `$ ${earning?.selfReward?.last7Days || 0}`,
      icon: <Wallet className="h-8 w-8 text-red-400" />,
      percentage: `${earning?.selfReward?.last7DaysVsPrevious7DaysPercentage || 0}%`,
      percentageColor: String(earning?.selfReward?.last7DaysVsPrevious7DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-red-400",
    },
    {
      title: "Last 30 Days Earning",
      amount: `$ ${earning?.selfReward?.last30Days || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      percentage: `${earning?.selfReward?.last30DaysVsPrevious30DaysPercentage || 0}%`,
      percentageColor: String(earning?.selfReward?.last30DaysVsPrevious30DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-green-400",
    },
    {
      title: "Total Earning",
      amount: `$ ${earning?.selfReward?.total || 0}`,
      icon: <Database className="h-8 w-8 text-orange-400" />,
      percentage: "NA",
      percentageColor: "text-red-400",
      barColor: "bg-yellow-400",
    },
  ];

  const statsRewardHistory = [
    {
      title: "Today Earning",
      amount: `$ ${earning?.totalEarning?.today || 0}`,
      icon: <DollarSign className="h-8 w-8 text-blue-400" />,
      percentage: `${earning?.totalEarning?.todayVsYesterdayPercentage || 0}%`,
      percentageColor: String(earning?.totalEarning?.todayVsYesterdayPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-blue-400",
    },
    {
      title: "Last 7 Days Earning",
      amount: `$ ${earning?.totalEarning?.last7Days || 0}`,
      icon: <Wallet className="h-8 w-8 text-red-400" />,
      percentage: `${earning?.totalEarning?.last7DaysVsPrevious7DaysPercentage || 0}%`,
      percentageColor: String(earning?.totalEarning?.last7DaysVsPrevious7DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-red-400",
    },
    {
      title: "Last 30 Days Earning",
      amount: `$ ${earning?.totalEarning?.last30Days || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      percentage: `${earning?.totalEarning?.last30DaysVsPrevious30DaysPercentage || 0}%`,
      percentageColor: String(earning?.totalEarning?.last30DaysVsPrevious30DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-green-400",
    },
    {
      title: "Total Earning",
      amount: `$ ${earning?.totalEarning?.total || 0}`,
      icon: <Database className="h-8 w-8 text-orange-400" />,
      percentage: "NA",
      percentageColor: "text-red-400",
      barColor: "bg-yellow-400",
    },
  ];

  const statsRankReward = [
    {
      title: "Today Earning",
      amount: `$ ${earning?.rankReward?.today || 0}`,
      icon: <DollarSign className="h-8 w-8 text-blue-400" />,
      percentage: `${earning?.rankReward?.todayVsYesterdayPercentage || 0}%`,
      percentageColor: String(earning?.rankReward?.todayVsYesterdayPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-blue-400",
    },
    {
      title: "Last 7 Days Earning",
      amount: `$ ${earning?.rankReward?.last7Days || 0}`,
      icon: <Wallet className="h-8 w-8 text-red-400" />,
      percentage: `${earning?.rankReward?.last7DaysVsPrevious7DaysPercentage || 0}%`,
      percentageColor: String(earning?.rankReward?.last7DaysVsPrevious7DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-red-400",
    },
    {
      title: "Last 30 Days Earning",
      amount: `$ ${earning?.rankReward?.last30Days || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      percentage: `${earning?.rankReward?.last30DaysVsPrevious30DaysPercentage || 0}%`,
      percentageColor: String(earning?.rankReward?.last30DaysVsPrevious30DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-green-400",
    },
    {
      title: "Total Earning",
      amount: `$ ${earning?.rankReward?.total || 0}`,
      icon: <Database className="h-8 w-8 text-orange-400" />,
      percentage: "NA",
      percentageColor: "text-red-400",
      barColor: "bg-yellow-400",
    },
  ];

  const statsLevelReward = [
    {
      title: "Today Earning",
      amount: `$ ${earning?.levelReward?.today || 0}`,
      icon: <DollarSign className="h-8 w-8 text-blue-400" />,
      percentage: `${earning?.levelReward?.todayVsYesterdayPercentage || 0}%`,
      percentageColor: String(earning?.levelReward?.todayVsYesterdayPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-blue-400",
    },
    {
      title: "Last 7 Days Earning",
      amount: `$ ${earning?.levelReward?.last7Days || 0}`,
      icon: <Wallet className="h-8 w-8 text-red-400" />,
      percentage: `${earning?.levelReward?.last7DaysVsPrevious7DaysPercentage || 0}%`,
      percentageColor: String(earning?.levelReward?.last7DaysVsPrevious7DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-red-400",
    },
    {
      title: "Last 30 Days Earning",
      amount: `$ ${earning?.levelReward?.last30Days || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      percentage: `${earning?.levelReward?.last30DaysVsPrevious30DaysPercentage || 0}%`,
      percentageColor: String(earning?.levelReward?.last30DaysVsPrevious30DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-green-400",
    },
    {
      title: "Total Earning",
      amount: `$ ${earning?.levelReward?.total || 0}`,
      icon: <Database className="h-8 w-8 text-orange-400" />,
      percentage: "NA",
      percentageColor: "text-red-400",
      barColor: "bg-yellow-400",
    },
  ];

  const statsReferralReward = [
    {
      title: "Today Earning",
      amount: `$ ${earning?.referralReward?.today || 0}`,
      icon: <DollarSign className="h-8 w-8 text-blue-400" />,
      percentage: `${earning?.referralReward?.todayVsYesterdayPercentage || 0}%`,
      percentageColor: String(earning?.referralReward?.todayVsYesterdayPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-blue-400",
    },
    {
      title: "Last 7 Days Earning",
      amount: `$ ${earning?.referralReward?.last7Days || 0}`,
      icon: <Wallet className="h-8 w-8 text-red-400" />,
      percentage: `${earning?.referralReward?.last7DaysVsPrevious7DaysPercentage || 0}%`,
      percentageColor: String(earning?.referralReward?.last7DaysVsPrevious7DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-red-400",
    },
    {
      title: "Last 30 Days Earning",
      amount: `$ ${earning?.referralReward?.last30Days || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      percentage: `${earning?.referralReward?.last30DaysVsPrevious30DaysPercentage || 0}%`,
      percentageColor: String(earning?.referralReward?.last30DaysVsPrevious30DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-green-400",
    },
    {
      title: "Total Earning",
      amount: `$ ${earning?.referralReward?.total || 0}`,
      icon: <Database className="h-8 w-8 text-orange-400" />,
      percentage: "NA",
      percentageColor: "text-red-400",
      barColor: "bg-yellow-400",
    },
  ];

  const stars = generateStars();

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    return date.toLocaleString('en-IN', options);
  }
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
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl z-[-1]"></div>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">
            All Reward
          </h1>

          {/* Button Tabs (scrollable on mobile) */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {[
                { key: "selfPackage", label: "Self Packages History" },
                { key: "selfReward", label: "Self Income" },
                // { key: "referralReward", label: "Referral Reward" },
                { key: "levelReward", label: "Level Bonus" },
                { key: "rankReward", label: "Rank Reward" },
                { key: "rewardHistory", label: "History" },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  onClick={() => setOpenReward(key)}
                  variant={openReward === key ? "default" : "outline"}
                  className={`whitespace-nowrap ${openReward === key ? "btn-gold" : "btn-outline"
                    }`}
                >
                  <span className="text-sm sm:text-base">{label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        {openReward === "selfPackage" && (
          selfRewardLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <>
              {/* Filters */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">Filter Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Id, amount..."
                        value={searchW4Term}
                        onChange={(e) => setSearchW4Term(e.target.value)}
                        className="pl-10 bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    {/* Date Range Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto btn-outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateW4Range}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border z-50">
                        {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel> */}
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setDateW4Range('All Time')}>
                          All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Today')}>
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Yesturday')}>
                          Yesturday
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Last 7 days')}>
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Last 30 days')}>
                          Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Last 90 days')}>
                          Last 90 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Reward ({filteredW4Transactions?.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentW4Transactions?.length > 0 ?
                    <div className='overflow-x-auto whitespace-nowrap'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Package Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Date | Time</TableHead>
                            <TableHead>Expiry Date | Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentW4Transactions?.map((reward) => (
                            <TableRow key={reward.id}>
                              <TableCell className="">
                                {reward.packageName}
                              </TableCell>
                              <TableCell>
                                {`$${reward.depositAmount}`}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {`${reward.percentage}%`}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                ${reward.commissionAmount}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(reward.createdAt)}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(reward.expiryDate)}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reward.status === "active" ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"}`}>
                                  {reward.status === "active" ? "Active" : "Inactive"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalW4Pages > 0 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentW4Page(Math.max(1, currentW4Page - 1))}
                                  className={currentW4Page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>

                              {[...Array(totalW4Pages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                  page === 1 ||
                                  page === totalW4Pages ||
                                  (page >= currentW4Page - 1 && page <= currentW4Page + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentW4Page(page)}
                                        isActive={page === currentW4Page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentW4Page - 2 ||
                                  page === currentW4Page + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentW4Page(Math.min(totalW4Pages, currentW4Page + 1))}
                                  className={currentW4Page === totalW4Pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    :
                    <div className='flex justify-center'>No record found.</div>
                  }
                </CardContent>
              </Card>
            </>
        )}
        {openReward === "selfReward" && (
          totalSelfRewardLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <>
              {/* Reward Overview */}
              <div className="feature-card mb-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-gold-text">
                    Earning Overview
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEarningVisible(!earningVisible)}
                    className="text-gray-400 hover:text-white"
                  >
                    {earningVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsSelfReward.map((item, index) => (
                    <div
                      key={index}
                      className="stat-card text-white rounded-2xl p-4 shadow-lg border border-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-start">
                          <p className="text-sm text-gray-400">{item.title}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {earningVisible
                              ? `${item.amount}`
                              : "••••"}
                          </p>
                        </div>
                        <div className="text-end">
                          {item.icon}
                          <p
                            className={`text-sm font-semibold ${item.percentageColor}`}
                          >
                            {item.percentage}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-1 h-6 items-end">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${item.barColor} w-1 rounded`}
                            style={{ height: `${Math.random() * 24 + 4}px` }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">Filter Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Id, amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    {/* Date Range Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto btn-outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateRange}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border z-50">
                        {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel> */}
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setDateRange('All Time')}>
                          All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Today')}>
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Yesturday')}>
                          Yesturday
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateRange('Last 7 days')}>
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateRange('Last 30 days')}>
                          Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateRange('Last 90 days')}>
                          Last 90 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Reward ({filteredTransactions?.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentTransactions?.length > 0 ?
                    <div className='overflow-x-auto whitespace-nowrap'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Date | Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTransactions?.map((dailySelf) => (
                            <TableRow key={dailySelf.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="capitalize text-white">{dailySelf.type}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-white font-mono text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-mono text-sm">{dailySelf.percentage}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                ${dailySelf.commissionAmount}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(dailySelf.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400`}>
                                  Success
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalPages > 0 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>

                              {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={page === currentPage}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentPage - 2 ||
                                  page === currentPage + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    :
                    <div className='flex justify-center'>No record found.</div>
                  }
                </CardContent>
              </Card>
            </>
        )}
        {openReward === "referralReward" && (
          referralHistoryLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <>
              {/* Reward Overview */}
              <div className="feature-card mb-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-gold-text">
                    Earning Overview
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEarningVisible(!earningVisible)}
                    className="text-gray-400 hover:text-white"
                  >
                    {earningVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsReferralReward.map((item, index) => (
                    <div
                      key={index}
                      className="stat-card text-white rounded-2xl p-4 shadow-lg border border-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-start">
                          <p className="text-sm text-gray-400">{item.title}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {earningVisible
                              ? `${item.amount}`
                              : "••••"}
                          </p>
                        </div>
                        <div className="text-end">
                          {item.icon}
                          <p
                            className={`text-sm font-semibold ${item.percentageColor}`}
                          >
                            {item.percentage}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-1 h-6 items-end">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${item.barColor} w-1 rounded`}
                            style={{ height: `${Math.random() * 24 + 4}px` }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">Filter Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Id, amount..."
                        value={searchWTerm}
                        onChange={(e) => setSearchWTerm(e.target.value)}
                        className="pl-10 bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    {/* Date Range Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto btn-outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateWRange}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border z-50">
                        {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setDateWRange('All Time')}>
                          All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Today')}>
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Yesturday')}>
                          Yesturday
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateWRange('Last 7 days')}>
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateWRange('Last 30 days')}>
                          Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateWRange('Last 90 days')}>
                          Last 90 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Reward ({filteredWTransactions?.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentWTransactions?.length > 0 ?
                    <div className='overflow-x-auto whitespace-nowrap'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Date | Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentWTransactions?.map((referral) => (
                            <TableRow key={referral.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="capitalize text-white">{`${referral.firstName || ""} ${referral.lastName || ""}`}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-white font-mono text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-mono text-sm">{referral.email}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {referral.percentage}%
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                ${referral.commissionAmount}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(referral.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400`}>
                                  Success
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalWPages > 0 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentWPage(Math.max(1, currentWPage - 1))}
                                  className={currentWPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>

                              {[...Array(totalWPages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                  page === 1 ||
                                  page === totalWPages ||
                                  (page >= currentWPage - 1 && page <= currentWPage + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentWPage(page)}
                                        isActive={page === currentWPage}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentWPage - 2 ||
                                  page === currentWPage + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentWPage(Math.min(totalWPages, currentWPage + 1))}
                                  className={currentWPage === totalWPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    :
                    <div className='flex justify-center'>No record found.</div>
                  }
                </CardContent>
              </Card>
            </>
        )}
        {openReward === "levelReward" && (
          totalLevelLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <>
              {/* Reward Overview */}
              <div className="feature-card mb-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-gold-text">
                    Earning Overview
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEarningVisible(!earningVisible)}
                    className="text-gray-400 hover:text-white"
                  >
                    {earningVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsLevelReward.map((item, index) => (
                    <div
                      key={index}
                      className="stat-card text-white rounded-2xl p-4 shadow-lg border border-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-start">
                          <p className="text-sm text-gray-400">{item.title}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {earningVisible
                              ? `${item.amount}`
                              : "••••"}
                          </p>
                        </div>
                        <div className="text-end">
                          {item.icon}
                          <p
                            className={`text-sm font-semibold ${item.percentageColor}`}
                          >
                            {item.percentage}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-1 h-6 items-end">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${item.barColor} w-1 rounded`}
                            style={{ height: `${Math.random() * 24 + 4}px` }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">Filter Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Id, amount..."
                        value={searchW1Term}
                        onChange={(e) => setSearchW1Term(e.target.value)}
                        className="pl-10 bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    {/* Date Range Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto btn-outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateW1Range}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border z-50">
                        {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setDateW1Range('All Time')}>
                          All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Today')}>
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Yesturday')}>
                          Yesturday
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW1Range('Last 7 days')}>
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW1Range('Last 30 days')}>
                          Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW1Range('Last 90 days')}>
                          Last 90 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Reward ({filteredW1Transactions?.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentW1Transactions?.length > 0 ?
                    <div className='overflow-x-auto whitespace-nowrap'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Date | Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentW1Transactions?.map((level) => (
                            <TableRow key={level.id}>
                              <TableCell className="">
                                {level.type}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {level.percentage}%
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                ${level.commissionAmount}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(level.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400`}>
                                  Success
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalW1Pages > 0 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentW1Page(Math.max(1, currentW1Page - 1))}
                                  className={currentW1Page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>

                              {[...Array(totalW1Pages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                  page === 1 ||
                                  page === totalW1Pages ||
                                  (page >= currentW1Page - 1 && page <= currentW1Page + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentW1Page(page)}
                                        isActive={page === currentW1Page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentW1Page - 2 ||
                                  page === currentW1Page + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentW1Page(Math.min(totalW1Pages, currentW1Page + 1))}
                                  className={currentW1Page === totalW1Pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    :
                    <div className='flex justify-center'>No record found.</div>
                  }
                </CardContent>
              </Card>
            </>
        )}
        {openReward === "rankReward" && (
          totalRankLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <>
              {/* Reward Overview */}
              <div className="feature-card mb-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-gold-text">
                    Earning Overview
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEarningVisible(!earningVisible)}
                    className="text-gray-400 hover:text-white"
                  >
                    {earningVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsRankReward.map((item, index) => (
                    <div
                      key={index}
                      className="stat-card text-white rounded-2xl p-4 shadow-lg border border-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-start">
                          <p className="text-sm text-gray-400">{item.title}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {earningVisible
                              ? `${item.amount}`
                              : "••••"}
                          </p>
                        </div>
                        <div className="text-end">
                          {item.icon}
                          <p
                            className={`text-sm font-semibold ${item.percentageColor}`}
                          >
                            {item.percentage}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-1 h-6 items-end">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${item.barColor} w-1 rounded`}
                            style={{ height: `${Math.random() * 24 + 4}px` }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">Filter Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Id, amount..."
                        value={searchW3Term}
                        onChange={(e) => setSearchW3Term(e.target.value)}
                        className="pl-10 bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    {/* Date Range Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto btn-outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateW3Range}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border z-50">
                        {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setDateW3Range('All Time')}>
                          All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Today')}>
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Yesturday')}>
                          Yesturday
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW3Range('Last 7 days')}>
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW3Range('Last 30 days')}>
                          Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW3Range('Last 90 days')}>
                          Last 90 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
              {/* Transactions Table */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Reward ({filteredW3Transactions?.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentW3Transactions?.length > 0 ?
                    <div className='overflow-x-auto whitespace-nowrap'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Date | Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentW3Transactions?.map((reward) => (
                            <TableRow key={reward.id}>
                              <TableCell className="">
                                {reward.type}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                ${reward.commissionAmount}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(reward.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400`}>
                                  Success
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalW3Pages > 0 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentW3Page(Math.max(1, currentW3Page - 1))}
                                  className={currentW3Page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>

                              {[...Array(totalW3Pages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                  page === 1 ||
                                  page === totalW3Pages ||
                                  (page >= currentW3Page - 1 && page <= currentW3Page + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentW3Page(page)}
                                        isActive={page === currentW3Page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentW3Page - 2 ||
                                  page === currentW3Page + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentW3Page(Math.min(totalW3Pages, currentW3Page + 1))}
                                  className={currentW3Page === totalW3Pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    :
                    <div className='flex justify-center'>No record found.</div>
                  }
                </CardContent>
              </Card>
            </>
        )}
        {openReward === "rewardHistory" && (
          totalDailyfRewardLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <>
              {/* Reward Overview */}
              <div className="feature-card mb-8">
                <div className="flex flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-gold-text">
                    Earning Overview
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEarningVisible(!earningVisible)}
                    className="text-gray-400 hover:text-white"
                  >
                    {earningVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsRewardHistory.map((item, index) => (
                    <div
                      key={index}
                      className="stat-card text-white rounded-2xl p-4 shadow-lg border border-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-start">
                          <p className="text-sm text-gray-400">{item.title}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {earningVisible
                              ? `${item.amount}`
                              : "••••"}
                          </p>
                        </div>
                        <div className="text-end">
                          {item.icon}
                          <p
                            className={`text-sm font-semibold ${item.percentageColor}`}
                          >
                            {item.percentage}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-1 h-6 items-end">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${item.barColor} w-1 rounded`}
                            style={{ height: `${Math.random() * 24 + 4}px` }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">Filter Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Id, amount..."
                        value={searchW2Term}
                        onChange={(e) => setSearchW2Term(e.target.value)}
                        className="pl-10 bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    {/* Date Range Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto btn-outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateW2Range}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border z-50">
                        {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setDateW2Range('All Time')}>
                          All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Today')}>
                          Today
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW4Range('Yesturday')}>
                          Yesturday
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW2Range('Last 7 days')}>
                          Last 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW2Range('Last 30 days')}>
                          Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDateW2Range('Last 90 days')}>
                          Last 90 days
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Reward ({filteredW2Transactions?.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentW2Transactions?.length > 0 ?
                    <div className='overflow-x-auto whitespace-nowrap'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Date | Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentW2Transactions?.map((reward) => (
                            <TableRow key={reward.id}>
                              <TableCell className="">
                                {reward.type}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reward.type === "Rank Reward" ? `NA` : `${reward.percentage}%`}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                ${reward.commissionAmount}
                              </TableCell>
                              <TableCell>
                                {formatDateTime(reward.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400`}>
                                  Success
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalW2Pages > 0 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => setCurrentW2Page(Math.max(1, currentW2Page - 1))}
                                  className={currentW2Page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>

                              {[...Array(totalW2Pages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                  page === 1 ||
                                  page === totalW2Pages ||
                                  (page >= currentW2Page - 1 && page <= currentW2Page + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentW2Page(page)}
                                        isActive={page === currentW2Page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentW2Page - 2 ||
                                  page === currentW2Page + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}

                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => setCurrentW2Page(Math.min(totalW2Pages, currentW2Page + 1))}
                                  className={currentW2Page === totalW2Pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    :
                    <div className='flex justify-center'>No record found.</div>
                  }
                </CardContent>
              </Card>
            </>
        )}
      </div>
    </div>
  );
};

export default RewardHistoryList;
