import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  Calculator,
  Plus,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Loader2,
  AlertTriangle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { packageServices } from "../../Services/packageServices";
import { plateformServices } from "../../Services/plateformServices";
import stakingService from "../services/stakingService";
import { useStakingWallet } from "@/hooks/useStakingWallet";
import { useWallet } from "@/hooks/useWallet";
import { bsc } from "wagmi/chains";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
const StakingHub = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [packages, setPackages] = useState([]);
  const [calculatedReward, setCalculatedReward] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [isStakingPopup, setIsStakingPopup] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [stackingBenfit, setStackingBenfit] = useState({
    highData: "",
    secureData: "",
    dailyData: "",
    referralData: "",
  });
  const { toast } = useToast();
  const {
    isConnected,
    address,
    isCorrectNetwork,
    chainId,
    checkAndSwitchNetwork,
  } = useStakingWallet();
  const { connectWallet } = useWallet();

  const handleClickConnectWallet = async () => {
    await connectWallet();
    sessionStorage.setItem("walletReload", "true");
  };

  if (sessionStorage.getItem("walletReload")) {
    sessionStorage.removeItem("walletReload");
    window.location.reload();
  }

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    // Wait until UI updates before calculating rewards
    setTimeout(() => {
      if (stakeAmount) {
        const rewards = calculateRewards(parseFloat(stakeAmount), pkg);
        setCalculatedReward(rewards);
      }
    }, 0);
  };

  const getPackageData = async () => {
    let data = await packageServices.getPackageData("user");
    setPackages(data?.data || []);
  };

  const getPlateformData = async () => {
    let data = await plateformServices.getPlateformData();
    setStackingBenfit(data?.stackingBenfit);
  };

  const [transactionsLoader, setTransactionsLoader] = useState(false);
  const getTransections = async () => {
    setTransactionsLoader(true)
    let data = await plateformServices.getTransections();
    setAllTransactions(data?.data || []);
    setTransactionsLoader(false)
  };

  const walletAddress = JSON.parse(localStorage.getItem("walletAddress"));

  const addNewTransections = async (status, approvalHash, transactionHash) => {
    setIsStakingPopup(true)
    let userData = {};
    userData.amount = stakeAmount;
    userData.status = status;
    userData.approvalHash = approvalHash;
    userData.transactionHash = transactionHash;
    userData.address = walletAddress;
    userData.packageId = selectedPackage?._id;
    await plateformServices.addNewTransections(userData);
    setIsStakingPopup(false)
      
  };

  // Get user's USDT balance
  const getUserBalance = async () => {
    if (!isConnected || !address || !isCorrectNetwork) return;

    try {
      await stakingService.initialize();
      const balance = await stakingService.getUSDTBalance(address);
      setUserBalance(parseFloat(balance));
    } catch (error) {
      console.error("Error getting user balance:", error);
      toast({
        title: error,
        description:
          "Failed to get USDT balance. Please check your wallet connection.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getPlateformData();
    getPackageData();
    getTransections();
  }, []);

  useEffect(() => {
    if (isConnected && address && isCorrectNetwork) {
      getUserBalance();
    }
  }, [isConnected, address, isCorrectNetwork]);

  const calculateRewards = (amount, packageData) => {
    if (!amount || !packageData) return 0;
    const daily = (amount * packageData?.dailyReturn) / 100;
    const monthly = daily * 30;
    const yearly = (amount * packageData.reward) / 100;
    return { daily, monthly, yearly };
  };

  const handleAmountChange = (value) => {
    setStakeAmount(value);
    if (selectedPackage && value) {
      const rewards = calculateRewards(parseFloat(value), selectedPackage);
      setCalculatedReward(rewards);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleStake = async () => {
    // Check wallet connection and network
    const canProceed = await checkAndSwitchNetwork();
    if (!canProceed) return;

    if (!selectedPackage || !stakeAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a package and enter stake amount.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (
      amount < selectedPackage.minAmount ||
      amount > selectedPackage.maxAmount
    ) {
      toast({
        title: `Amount must be between $${selectedPackage.minAmount} and $${selectedPackage.maxAmount}`,
        description: `Amount must be between $${selectedPackage.minAmount} and $${selectedPackage.maxAmount}`,
        variant: "destructive",
      });
      return;
    }

    if (amount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${amount} USDT but have ${userBalance.toFixed(
          2
        )} USDT`,
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);

    try {
      // Initialize staking service
      await stakingService.initialize();

      // Show initial toast
      toast({
        title: "Staking in Progress",
        description: "Please confirm the transaction in your wallet...",
      });

      // Complete staking process
      const result = await stakingService.completeStaking(amount);
      // Check if the result indicates success
      if (result && result.success && result.stakeHash) {
        // Success toast
        toast({
          title: "Transection is Processed Please Wait! 🎉",
          description: `Processed stake ${amount} USDT. Transaction: ${result.stakeHash.slice(
            0,
            10
          )}...`,
        });

        // Reset form
        setStakeAmount("");
        setCalculatedReward(0);

        // Refresh user balance
        await getUserBalance();
      } else {
        throw new Error("Staking transaction failed");
      }
      if (result?.success) {
        localStorage.setItem("referralCode", JSON.stringify(true));
        addNewTransections(
          "completed",
          result?.approvalHash,
          result?.stakeHash
        );
      } else {
        addNewTransections(
          "failed",
          result?.approvalHash || "",
          result?.stakeHash || ""
        );
      }
    } catch (error) {
      console.error("Staking error:", error);

      let errorMessage = "Staking failed. Please try again.";

      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user.";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction.";
      } else if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was cancelled.";
      } else if (error.message.includes("Staking transaction failed")) {
        errorMessage =
          "Transaction failed. Please check your wallet and try again.";
      }

      toast({
        title: "Staking Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return (
          <Badge className="bg-green-400/20 text-green-400">Completed</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-400/20 text-orange-400">Pending</Badge>
        );
      case "failed":
        return <Badge className="bg-red-400/20 text-red-400">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

  const renderWalletStatus = () => {
    if (!isConnected) {
      return (
        <div className="text-center py-8">
          <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Connect your wallet to start staking
          </p>
          <Button variant="outline" className="w-full" onClick={handleClickConnectWallet}>
            Connect Wallet
          </Button>
        </div>
      );
    }

    if (!isCorrectNetwork) {
      return (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-yellow-500 mb-2 font-semibold">Wrong Network</p>
          <p className="text-muted-foreground mb-4">
            Current: Chain ID {chainId}
            <br />
            Required: BSC Testnet (Chain ID {bsc.id})
          </p>
          <Button
            onClick={checkAndSwitchNetwork}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Switch to BSC Testnet
          </Button>
        </div>
      );
    }

    return null;
  };

  function formatToCompact4Digit(num) {
    const units = ["", "M", "B", "T"];
    let unitIndex = 0;

    while (num >= 1000000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }

    if (unitIndex === 0) return num.toString();

    let str = Number.isInteger(num) ? num.toString() : num.toFixed(2);

    str = str.replace(/\.?0+$/, '');

    return str + units[unitIndex];
  }

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
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl"></div>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">
                Staking Package
              </h1>
              <p className="text-gray-400 mt-1">
                Choose the package that fits your investment goals
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
          {/* Package Selection */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card
                  key={pkg._id}
                  className={`feature-card cursor-pointer relative ${selectedPackage?._id === pkg._id
                    ? "ring-2 ring-primary shadow-lg shadow-primary/25"
                    : ""
                    }`}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl text-foreground">
                      {pkg.packageName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{pkg.tier}</p>
                    <div className="text-xl font-bold gradient-gold-text">
                      {Math.round(pkg.dailyReturn * 30)}% Monthly
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">
                        ${formatToCompact4Digit(pkg.minAmount)} - $
                        {formatToCompact4Digit(pkg.maxAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">Investment Range</p>
                    </div>

                    <ul className="space-y-2">
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                          {pkg.description}
                        </pre>
                      </div>
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent History Section */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground mb-2">Recent History</h2>
              {allTransactions?.length > 0 && (
                <Link to="/all-transactions">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    See All
                  </Button>
                </Link>
              )}
            </div>

            {/* Transactions Table */}
            {transactionsLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : allTransactions?.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Package/Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTransactions
                      ?.slice(0, 5)
                      ?.reverse()
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-white font-mono text-sm">
                            {transaction.hash ? (
                              <div className="flex items-center space-x-2">
                                <a
                                  href={`https://bscscan.com/tx/${transaction.hash}`}
                                  target="__blank"
                                >
                                  <span className="text-primary font-mono text-sm">{`${transaction.hash?.slice(
                                    0,
                                    6
                                  )}...${transaction.hash?.slice(-4)}`}</span>
                                </a>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(transaction.hash, "Hash Id")
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              "NA"
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold ${transaction.type === "staking"
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                            >
                              {transaction.type === "withdrawal" ? "-" : "+"}$
                              {transaction.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {transaction.package || "N/A"}
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(transaction.date)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex justify-center">No record found.</div>
            )}
          </div>

          {/* Stake Calculator & Action */}
          <div className="space-y-6">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Staking Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderWalletStatus() ||
                  (selectedPackage ? (
                    <>
                      <div className="p-4 bg-black/40 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          Selected Package
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">
                            {selectedPackage.packageName}
                          </span>
                          <span className="text-primary font-bold">
                            {selectedPackage.dailyReturn}% Daily
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                        <h4 className="font-semibold text-green-400 mb-2">
                          Your USDT Balance
                        </h4>
                        <div className="text-2xl font-bold text-green-400">
                          {userBalance.toFixed(2)} USDT
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stakeAmount" className="text-gray-300">
                          Stake Amount (USDT)
                        </Label>
                        <Input
                          id="stakeAmount"
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (Number(value) < 0) return;
                            handleAmountChange(value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e") {
                              e.preventDefault();
                            }
                          }}
                          placeholder={`Min: $${selectedPackage.minAmount}`}
                          min={selectedPackage.minAmount}
                          max={selectedPackage.maxAmount}
                          disabled={isStaking}
                        />
                        <p className="text-xs text-muted-foreground">
                          Range: ${selectedPackage.minAmount.toLocaleString()} -
                          ${selectedPackage.maxAmount.toLocaleString()}
                        </p>
                        {!stakeAmount && (
                          <p className="text-xs text-red-500">
                            Please Enter Amount.
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={handleStake}
                        className="btn-gold w-full text-lg py-6"
                        disabled={!stakeAmount || isStaking}
                      >
                        {isStaking ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Plus className="h-5 w-5 mr-2" />
                            Stake Now
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a package to calculate rewards
                      </p>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Benefits Summary */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Staking Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: TrendingUp,
                    title: "High Returns",
                    description: stackingBenfit?.highData,
                  },
                  {
                    icon: Shield,
                    title: "Secure Platform",
                    description: stackingBenfit?.secureData,
                  },
                  {
                    icon: Zap,
                    title: "Daily Rewards",
                    description: stackingBenfit?.dailyData,
                  },
                  {
                    icon: Award,
                    title: "Referral Bonuses",
                    description: stackingBenfit?.referralData,
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <benefit.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isStakingPopup}>
        <DialogContent
          className="max-w-md text-center p-6"
          onInteractOutside={(e) => e.preventDefault()}   // ⛔ Prevent backdrop close
          onEscapeKeyDown={(e) => e.preventDefault()}    // ⛔ Prevent ESC close
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Payment Processing ⏳
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <p className="text-gray-600">
              Please do not close or refresh this window while your transaction
              is being processed.
            </p>
            <p className="text-sm text-gray-500">Waiting for blockchain confirmation...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StakingHub;
