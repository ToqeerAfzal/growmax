
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import BalanceCards from '@/components/withdrawal/BalanceCards';
import WithdrawalForm from '@/components/withdrawal/WithdrawalForm';
import ProcessingInfo from '@/components/withdrawal/ProcessingInfo';
import RecentWithdrawals from '@/components/withdrawal/RecentWithdrawals';
import { useToast } from '@/hooks/use-toast';
import { plateformServices } from '../../Services/plateformServices';

const WithdrawalCenter = () => {
  const [withdrawalType, setWithdrawalType] = useState('rewards');
  const [amount, setAmount] = useState('');
  const [allTransection, setAllTransection] = useState([]);
  const { toast } = useToast();

  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [withdrawalFee, setWithdrawalFee] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletLoader, setWalletLoader] = useState(false);
  const [earlyPrincipleWithdrawalFee, setEarlyPrincipleWithdrawalFee] = useState("");

  const getUserDashboardTransections = async () => {
    let data = await plateformServices.getUserDashboardTransections()
    setTotalDeposit(Number(data?.totalDeposit || 0))
    setTotalReward(Number(data?.availableReward || 0))
    setWalletAddress(data?.address)
  }

  const getPlateformData = async () => {
    let data = await plateformServices.getPlateformData()
    setWithdrawalFee(data?.withdrawalFee);
    setEarlyPrincipleWithdrawalFee(data?.earlyPrincipleWithdrawalFee);
  }

  useEffect(() => {
    getPlateformData()
    getUserDashboardTransections()
  }, []);

  const fees = {
    rewards: withdrawalFee,
    principal: withdrawalFee,
    principalFee: earlyPrincipleWithdrawalFee,
    minimum: 50
  };


  const balances = {
    rewards: totalReward,
    principal: totalDeposit,
    total: totalReward + totalDeposit
  };

  const calculateFee = () => {
    const amountData = parseFloat(amount) || 0;
    const feePercent = withdrawalType === 'rewards' ? fees.rewards : fees.principal;
    return (amountData * feePercent) / 100;
  };

  const calculatePrincipleFee = () => {
    const amountData = parseFloat(amount) || 0;
    const feePercent = withdrawalType === 'rewards' ? 0 : fees.principalFee;
    return (amountData * feePercent) / 100;
  };

  const getWidthdrawlRequestData = async () => {
    let data = await plateformServices.getWidthdrawlRequestData()
    setAmount("")
    setAllTransection((data?.data).slice(0, 3))
  }

  useEffect(() => {
    getWidthdrawlRequestData();
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

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    const maxAmount = withdrawalType === 'rewards' ? balances.rewards : balances.principal;

    if (!withdrawAmount || withdrawAmount < fees.minimum) {
      toast({
        title: "Entered amount is below minimum withdrawal amount.",
        description: `Minimum withdrawal amount is $${fees.minimum}`,
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > maxAmount) {
      toast({
        title: "Insufficient Balance",
        description: `Maximum available: $${maxAmount.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Please connect your wallet address",
        description: "Please connect your wallet address",
        variant: "destructive"
      });
      return;
    }

    let userData = {}
    setWalletLoader(true)
    userData.mainAmount = amount
    userData.amount = (parseFloat(amount) - calculateFee() - calculatePrincipleFee()).toFixed(2)
    userData.address = walletAddress
    userData.type = withdrawalType
    userData.fee = calculateFee() + calculatePrincipleFee()
    let data = await plateformServices.addNewWidthdrawlRequest(userData)
    if (data?.statusCode === 200) {
      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been submitted for processing.",
      });
    }
    getWidthdrawlRequestData()
    getUserDashboardTransections()
    setWalletLoader(false)
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
          <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">Withdrawal Center</h1>
          <p className="text-gray-400 mt-1">Withdraw your earnings securely</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Withdrawal Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Balance Cards */}
            <BalanceCards balances={balances} />

            {/* Withdrawal Form */}
            <WithdrawalForm
              withdrawalType={withdrawalType}
              setWithdrawalType={setWithdrawalType}
              amount={amount}
              setAmount={setAmount}
              walletAddress={walletAddress}
              balances={balances}
              fees={fees}
              onWithdraw={handleWithdraw}
              walletLoader={walletLoader}
            />
          </div>

          {/* Withdrawal Info & History */}
          <div className="space-y-6">
            {/* Recent Withdrawals */}
            <RecentWithdrawals withdrawalHistory={allTransection} />

            {/* Processing Times */}
            <ProcessingInfo fees={fees} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalCenter;
