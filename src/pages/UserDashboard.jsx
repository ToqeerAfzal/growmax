import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
// import { useDashboard } from "@/hooks/useDashboard";
import { Button } from "@/components/ui/button"
import NavBar from "@/components/NavBar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Award,
  Copy,
  Eye,
  EyeOff,
  PiggyBank,
  CreditCard,
  UserPlus,
  ExternalLink,
  DollarSign,
  BarChart3,
  Wallet,
  Database,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { userServices } from "../../Services/userServices"
import { plateformServices } from "../../Services/plateformServices"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const UserDashboard = () => {
  const navigate = useNavigate()
  // const { data: dashboardData, loading, error, refetch } = useDashboard();
  const { toast } = useToast()
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [earningVisible, setEarningVisible] = useState(true)
  const [referralCode, setReferralCode] = useState("")
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [totalReward, setTotalReward] = useState(0)
  const [availableReward, setAvailableReward] = useState(0)
  const [totalWithdrawl, setTotalWithdrawl] = useState(0)
  const [directReferral, setDirectReferral] = useState(0)
  const [totalTeam, setTotalTeam] = useState(0)
  const [totalVolumn, setTotalVolumn] = useState(0)
  const [referralHistory, setReferralHistory] = useState([])
  const [levelHistory, setLevelHistory] = useState([])
  const [rankHistory, setRankHistory] = useState([])
  const [selfHistory, setSelfHistory] = useState([])
  const [rewardHistory, setRewardHistory] = useState([])
  const [rank, setRank] = useState(0)
  const [openReward, setOpenReward] = useState("selfReward")
  const [userName, setUserName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [restake, setRestake] = useState("")
  const [earning, setEarning] = useState({})

  const getUserDashboardTransections = async () => {
    let data = await plateformServices.getUserDashboardTransections()
    console.log(data)
    setTotalDeposit(data?.totalDeposit || 0)
    setTotalReward(data?.totalCommisiion || 0)
    setAvailableReward(data?.availableReward || 0)
    setTotalWithdrawl(data?.totalWithdrawl || 0)
    setDirectReferral(data?.directReferral || 0)
    setTotalTeam(data?.totalTeam || 0)
    setTotalVolumn(data?.totalVolumn || 0)
    setRestake(data?.restake || "")
  }

  const getUserDashboardEarning = async () => {
    let data = await plateformServices.getUserDashboardEarning()
    setEarning(data)
  }

  const getCurrectLoginUser = async () => {
    let data = await userServices.getCurrectLoginUser()
    setReferralCode(data?.referralCode)
    setRank(data?.rank || 0)
    setUserName(data?.userName)
    setFirstName(data?.firstName)
  }

  const [referralHistoryLoader, setReferralHistoryLoader] = useState(false)
  const getTotalReferralHistory = async () => {
    setReferralHistoryLoader(true)
    let data = await plateformServices.getTotalReferralHistory()
    setReferralHistory(data?.data || [])
    setReferralHistoryLoader(false)
  }

  const [totalLevelLoader, setTotalLevelLoader] = useState(false)
  const getTotalLevelHistory = async () => {
    setTotalLevelLoader(true)
    let data = await plateformServices.getDailyRewardHistory("level")
    setLevelHistory(data?.data || [])
    setTotalLevelLoader(false)
  }

  const [totalRankLoader, setTotalRankLoader] = useState(false)
  const getTotalRankHistory = async () => {
    setTotalRankLoader(true)
    let data = await plateformServices.getDailyRewardHistory("rank")
    setRankHistory(data?.data || [])
    setTotalRankLoader(false)
  }

  const [totalSelfRewardLoader, setTotalSelfRewardLoader] = useState(false)
  const getTotalSelfRewardHistory = async () => {
    setTotalSelfRewardLoader(true)
    let data = await plateformServices.getDailyRewardHistory("self")
    setSelfHistory(data?.data || [])
    setTotalSelfRewardLoader(false)
  }

  const [totalDailyfRewardLoader, setTotalDailyfRewardLoader] = useState(false)
  const getDailyRewardHistory = async () => {
    setTotalDailyfRewardLoader(true)
    let data = await plateformServices.getDailyRewardHistory("all")
    setRewardHistory(data?.data || [])
    setTotalDailyfRewardLoader(false)
  }

  useEffect(() => {
    getCurrectLoginUser()
    getUserDashboardTransections()
    getUserDashboardEarning()
    getTotalReferralHistory()
    getTotalLevelHistory()
    getTotalRankHistory()
    getTotalSelfRewardHistory()
    getDailyRewardHistory()
  }, [])

  const copyReferralCode = () => {
    if(referralCode) {
      navigator.clipboard.writeText(referralCode)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
    }
  }

  const stats = [
    {
      title: "Today Earning",
      amount: `$ ${earning?.todayCommission || 0}`,
      icon: <DollarSign className="h-8 w-8 text-blue-400" />,
      percentage: `${earning?.todayVsYesterdayPercentage || 0}%`,
      percentageColor: String(earning?.todayVsYesterdayPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-blue-400",
    },
    {
      title: "Last 7 Days Earning",
      amount: `$ ${earning?.last7DaysCommission || 0}`,
      icon: <Wallet className="h-8 w-8 text-red-400" />,
      percentage: `${earning?.last7DaysVsPrevious7DaysPercentage || 0}%`,
      percentageColor: String(earning?.last7DaysVsPrevious7DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-red-400",
    },
    {
      title: "Last 30 Days Earning",
      amount: `$ ${earning?.last30DaysCommission || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      percentage: `${earning?.last30DaysVsPrevious30DaysPercentage || 0}%`,
      percentageColor: String(earning?.last30DaysVsPrevious30DaysPercentage)?.includes("-") ? "text-red-400" : "text-green-400",
      barColor: "bg-green-400",
    },
    {
      title: "Total Earning",
      amount: `$ ${earning?.totalCommission || 0}`,
      icon: <Database className="h-8 w-8 text-orange-400" />,
      percentage: "NA",
      percentageColor: "text-red-400",
      barColor: "bg-yellow-400",
    },
  ]

  const generateStars = () => {
    const stars = []
    for(let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      })
    }
    return stars
  }

  const stars = generateStars()

  function formatDateTime(isoString) {
    const date = new Date(isoString)

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }

    return date.toLocaleString('en-IN', options)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-foreground relative overflow-hidden">
      {/* Animated Stars Background */ }
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        { stars.map((star) => (
          <div
            key={ star.id }
            className="absolute rounded-full bg-white animate-pulse"
            style={ {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: "2s",
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            } }
          />
        )) }
      </div>

      {/* Background elements */ }
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl z-[-1]"></div>

      <NavBar />

      {/* Main Content */ }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */ }
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1 capitalize">
                Welcome back, { userName || firstName }
              </p>
              { restake && referralCode && (
                <p className="text-red-400 mt-1">{ restake }</p>
              ) }
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant="outline"
                className="border-gold-400 text-gold-400 hover:bg-gold-400/10 hover:text-gold-300 bg-black/20"
                onClick={ () => navigate("/rank-income") }
              >
                { " " }
                Achivement & Rank:
                <Award className="h-4 w-4 mr-2" />
                { rank }
                <ExternalLink className="h-3 w-3 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Overview */ }
        <div className="feature-card mb-8">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-gold-text">
              Portfolio Overview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={ () => setBalanceVisible(!balanceVisible) }
              className="text-gray-400 hover:text-white"
            >
              { balanceVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              ) }
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <p className="text-sm text-gray-400 mb-1">Total Staked</p>
              <p className="text-2xl font-bold text-orange-400">
                { balanceVisible ? `$${totalDeposit || 0}` : "••••" }
              </p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-gray-400 mb-1">Available Rewards</p>
              <p className="text-2xl font-bold text-green-400">
                { balanceVisible ? `$${availableReward || 0}` : "••••" }
              </p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-gray-400 mb-1">Total Rewards</p>
              <p className="text-2xl font-bold text-green-400">
                { balanceVisible ? `$${totalReward || 0}` : "••••" }
              </p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-gray-400 mb-1">Total Withdrawn</p>
              <p className="text-2xl font-bold text-red-300">
                { balanceVisible ? `$${totalWithdrawl || 0}` : "••••" }
              </p>
            </div>
          </div>
        </div>

        {/* Reward Overview */ }
        <div className="feature-card mb-8">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-gold-text">
              Earning Overview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={ () => setEarningVisible(!earningVisible) }
              className="text-gray-400 hover:text-white"
            >
              { earningVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              ) }
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            { stats.map((item, index) => (
              <div
                key={ index }
                className="stat-card text-white rounded-2xl p-4 shadow-lg border border-gray-800"
              >
                <div className="flex justify-between items-center">
                  <div className="text-start">
                    <p className="text-sm text-gray-400">{ item.title }</p>
                    <p className="text-2xl font-bold text-foreground">
                      { earningVisible
                        ? `${item.amount}`
                        : "••••" }
                    </p>
                  </div>
                  <div className="text-end">
                    { item.icon }
                    <p
                      className={ `text-sm font-semibold ${item.percentageColor}` }
                    >
                      { item.percentage }
                    </p>
                  </div>
                </div>
                <div className="flex mt-4 space-x-1 h-6 items-end">
                  { Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={ i }
                      className={ `${item.barColor} w-1 rounded` }
                      style={ { height: `${Math.random() * 24 + 4}px` } }
                    ></span>
                  )) }
                </div>
              </div>
            )) }
          </div>
        </div>

        {/* Quick Actions */ }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/staking"
            className="btn-gold flex items-center justify-center h-12 text-md"
          >
            <PiggyBank className="h-6 w-6 mr-3" />
            <span>Start Staking</span>
          </Link>
          <Link
            to="/withdrawal"
            className="btn-outline flex items-center justify-center h-12 text-md"
          >
            <CreditCard className="h-6 w-6 mr-3" />
            <span>Withdraw Funds</span>
          </Link>
          <Link
            to="/referral"
            className="btn-outline flex items-center justify-center h-12 text-md"
          >
            <UserPlus className="h-6 w-6 mr-3" />
            <span>Invite Friends</span>
          </Link>
        </div>

        {/* Referral Section */ }
        <div className="feature-card mb-5">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-gold-text flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Referral Program
            </h2>
            <Button
              variant="link"
              onClick={ () => navigate("/referral") }
              className="text-gold-400 hover:text-gold-300"
            >
              See all
              <ExternalLink className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="bg-black/40 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Your Referral Code</p>
                  <p className="text-lg font-mono font-bold text-gold-400">
                    { referralCode || "Loading..." }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={ copyReferralCode }
                  className="text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="stat-card">
                <p className="text-2xl font-bold text-white">
                  { directReferral || 0 }
                </p>
                <p className="text-sm text-gray-400">Direct Referrals</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-white">
                  { totalTeam || 0 }
                </p>
                <p className="text-sm text-gray-400">Team Members</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-gold-400">
                  ${ totalVolumn || 0 }
                </p>
                <p className="text-sm text-gray-400">Team Volume</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-between overflow-x-auto pb-2 mb-2">
          <div className="flex gap-2">
            { [
              { key: "selfReward", label: "Self Income" },
              // { key: "referralReward", label: "Referral Reward" },
              { key: "levelReward", label: "Level Bonus" },
              { key: "rankReward", label: "Rank Reward" },
              { key: "rewardHistory", label: "History" },
            ].map(({ key, label }) => (
              <Button
                key={ key }
                variant={ openReward === key ? "default" : "outline" }
                className={
                  openReward === key
                    ? "btn-gold whitespace-nowrap"
                    : "btn-outline whitespace-nowrap"
                }
                onClick={ () => setOpenReward(key) }
              >
                { label }
              </Button>
            )) }
          </div>
          <Button
            variant="link"
            onClick={ () => navigate("/rewardHistory") }
            className="text-gold-400 hover:text-gold-300"
          >
            See all
            <ExternalLink className="h-4 w-4 ml-1.5" />
          </Button>
        </div>

        {/* Daily Reward History */ }
        { openReward === "selfReward" && (
          <div className="feature-card mt-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold gradient-gold-text flex items-center">
                <Users className="h-6 w-6 mr-3" />
                Self Income History
              </h2>
            </div>
            { totalSelfRewardLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : selfHistory?.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap">
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
                    { selfHistory.slice(0, 5)?.map((dailySelf) => (
                      <TableRow key={ dailySelf.id }>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="capitalize text-white">
                              { dailySelf.type }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-mono text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-mono text-sm">
                              { dailySelf.percentage }%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          ${ dailySelf.commissionAmount }
                        </TableCell>
                        <TableCell>{ formatDateTime(dailySelf.createdAt) }</TableCell>
                        <TableCell>
                          <span
                            className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400` }
                          >
                            Success
                          </span>
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center">No record found.</div>
            ) }
          </div>
        ) }

        {/* Referral Reward History */ }
        { openReward === "referralReward" && (
          <div className="feature-card mt-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold gradient-gold-text flex items-center">
                <Users className="h-6 w-6 mr-3" />
                Referral Reward History
              </h2>
            </div>
            { referralHistoryLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : referralHistory?.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap">
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
                    { referralHistory.slice(0, 5)?.map((referral) => (
                      <TableRow key={ referral.id }>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="capitalize text-white">{ `${referral.firstName || ""
                              } ${referral.lastName || ""}` }</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-mono text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-mono text-sm">
                              { referral.email }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          { referral.percentage }%
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          ${ referral.commissionAmount }
                        </TableCell>
                        <TableCell>{ formatDateTime(referral.createdAt) }</TableCell>
                        <TableCell>
                          <span
                            className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400` }
                          >
                            Success
                          </span>
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center">No record found.</div>
            ) }
          </div>
        ) }

        {/* Level Bonus History */ }
        { openReward === "levelReward" && (
          <div className="feature-card mt-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold gradient-gold-text flex items-center">
                <Users className="h-6 w-6 mr-3" />
                Level Bonus History
              </h2>
            </div>
            { totalLevelLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : levelHistory?.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap">
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
                    { levelHistory.slice(0, 5)?.map((level) => (
                      <TableRow key={ level.id }>
                        <TableCell className="">{ level.type }</TableCell>
                        <TableCell className="text-muted-foreground">
                          { level.percentage }%
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          ${ level.commissionAmount }
                        </TableCell>
                        <TableCell>{ formatDateTime(level.createdAt) }</TableCell>
                        <TableCell>
                          <span
                            className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400` }
                          >
                            Success
                          </span>
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center">No record found.</div>
            ) }
          </div>
        ) }

        {/* Rank Reward History */ }
        { openReward === "rankReward" && (
          <div className="feature-card mt-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold gradient-gold-text flex items-center">
                <Users className="h-6 w-6 mr-3" />
                Rank Reward History
              </h2>
            </div>
            { totalRankLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : rankHistory?.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap">
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
                    { rankHistory.slice(0, 5)?.map((reward) => (
                      <TableRow key={ reward.id }>
                        <TableCell className="">{ reward.type }</TableCell>
                        <TableCell className="text-muted-foreground">
                          ${ reward.commissionAmount }
                        </TableCell>
                        <TableCell>{ formatDateTime(reward.createdAt) }</TableCell>
                        <TableCell>
                          <span
                            className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400` }
                          >
                            Success
                          </span>
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center">No record found.</div>
            ) }
          </div>
        ) }

        {/* Reward History */ }
        { openReward === "rewardHistory" && (
          <div className="feature-card mt-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold gradient-gold-text flex items-center">
                <Users className="h-6 w-6 mr-3" />
                History
              </h2>
            </div>
            { totalDailyfRewardLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : rewardHistory?.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap">
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
                    { rewardHistory
                      ?.reverse()
                      .slice(0, 5)
                      ?.map((reward) => (
                        <TableRow key={ reward.id }>
                          <TableCell className="">{ reward.type }</TableCell>
                          <TableCell className="text-muted-foreground">
                            { reward.percentage }%
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            ${ reward.commissionAmount }
                          </TableCell>
                          <TableCell>{ formatDateTime(reward.createdAt) }</TableCell>
                          <TableCell>
                            <span
                              className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400` }
                            >
                              Success
                            </span>
                          </TableCell>
                        </TableRow>
                      )) }
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center">No record found.</div>
            ) }
          </div>
        ) }
      </div>
    </div>
  )
}

export default UserDashboard
