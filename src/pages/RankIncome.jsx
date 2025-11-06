import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import NavBar from "@/components/NavBar";

import {
  Award,
  ArrowUp,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Clock,
  ArrowDown,
  DollarSign,
} from "lucide-react";
import { plateformServices } from "../../Services/plateformServices";

const RankIncome = () => {
  const [currentRank] = useState("Silver");
  const [nextRank, setNextRank] = useState("");
  const [nextRankBusiness, setNextRankBusiness] = useState(0);
  const [rankName, setRankName] = useState("");
  const [rank, setRank] = useState("");
  const [rankBonus, setRankBonus] = useState("");
  const [totalCommisiion, setTotalCommisiion] = useState("");
  const [totalTeam, setTotalTeam] = useState(0);
  const [totalVolumn, setTotalVolumn] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalRank, setTotalRank] = useState([]);
  const [rankProgress, setRankProgress] = useState([]);

  const getRankDetails = async () => {
    let data = await plateformServices.getRankDetails();
    setRankName(data?.rankName);
    setRank(data?.checkRank);
    setRankBonus(data?.rankBonus);
    setNextRank(data?.nextRankName);
    setNextRankBusiness(data?.nextRankBusiness);
    setTotalCommisiion(data?.totalCommisiion);
  };

  const getPlateformData = async () => {
    let data = await plateformServices.getPlateformData();
    if (data?.rankSettings) {
      setTotalRank(convertToRankArray(data?.rankSettings) || []);
    }
  };

  const getUserRankProgress = async () => {
    let data = await plateformServices.getUserRankProgress();
    setRankProgress(data)
  };

  console.log(">>rankProgress", rankProgress);


  function convertToRankArray(data) {
    const rankArray = [];

    for (let i = 1; i <= 10; i++) {
      const rankKey = `rank${i}`;
      const businessKey = `rank${i}Business`;
      const bonusKey = `rank${i}Bonus`;
      const eligibilityKey = `rank${i}Eligibility`;

      if (data[rankKey]) {
        const rankObj = {
          rank: data[rankKey],
          business: data[businessKey],
          bonus: data[bonusKey],
        };

        if (data[eligibilityKey]) {
          rankObj.eligibility = data[eligibilityKey];
        }

        rankArray.push(rankObj);
      }
    }

    return rankArray;
  }

  const getUserDashboardTransections = async () => {
    let data = await plateformServices.getUserDashboardTransections();

    setTotalTeam(data?.totalTeam || 0);
    setTotalVolumn(data?.totalVolumn || 0);
    setTotalDeposit(data?.totalDeposit || 0);
  };

  const getRankWiseProgress = (rank) => {
    let result = rankProgress?.find(item => item.rank === rank)
    return result
  }

  useEffect(() => {
    getRankDetails();
    getPlateformData();
    getUserDashboardTransections();
    getUserRankProgress()
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
      <div className="absolute top-10 right-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl"></div>
      <NavBar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Current Rank and Income */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Current Rank Card */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-6 w-6 text-coinstake-gold" />
                Current Rank: {rank}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center flex-wrap space-x-2">
                  <div
                    className={`w-16 h-16 bg-coinstake-gold rounded-full flex items-center justify-center`}
                  >
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {rankName} Member
                    </h3>
                    <p className="text-muted-foreground">
                      Rank Bonus: ${rankBonus}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monthly Reward
                    </span>
                    <span className="text-coinstake-gold font-bold">
                      ${rankBonus}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Month Income</span>
                    <span className="text-green-400 font-bold">${userStats.monthlyIncome}</span>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                Income Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  ${totalCommisiion}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Rank Income Earned
                </p>
                {/* <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-white">${userStats.monthlyIncome}</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-coinstake-gold">{currentRankData?.bonusPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Bonus Rate</p>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Rank */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-white">
              Progress to {nextRank} Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-coinstake-gold mb-2">
                  {Math.round((totalVolumn / nextRankBusiness) * 100)}%
                </p>
                <p className="text-muted-foreground">
                  Overall Progress to {nextRank}
                </p>
                <Progress
                  value={Math.round((totalVolumn / nextRankBusiness) * 100)}
                  className="h-4 mt-4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Staking Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-white">
                        Staking Amount
                      </span>
                    </div>
                    {/* <Badge className={progressToNextRank.staking >= 100 ? 'bg-green-400/20 text-green-400' : 'bg-orange-400/20 text-orange-400'}>
                      {progressToNextRank.staking >= 100 ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          {progressToNextRank.staking.toFixed(0)}%
                        </>
                      )}
                    </Badge> */}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${totalDeposit}
                  </div>
                  {/* <Progress value={totalDeposit} className="h-2" /> */}
                </div>

                {/* Referrals Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        Total Team
                      </span>
                    </div>
                    {/* <Badge className={progressToNextRank.referrals >= 100 ? 'bg-green-400/20 text-green-400' : 'bg-orange-400/20 text-orange-400'}>
                      </Badge> */}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {totalTeam}
                  </div>
                  {/* <Progress value={progressToNextRank.referrals} className="h-2" /> */}
                </div>

                {/* Business Volume Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">
                        Team Business
                      </span>
                    </div>
                    {/* <Badge className={progressToNextRank.business >= 100 ? 'bg-green-400/20 text-green-400' : 'bg-orange-400/20 text-orange-400'}>
                      </Badge> */}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${totalVolumn}
                  </div>
                  {/* <Progress value={progressToNextRank.business} className="h-2" /> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* {(currentRankDetails?.splitData || [])?.length > 0 && (
          <div className="feature-card mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentRankDetails?.splitData || [])?.map((item, index) => (
                <div key={index}>
                  <span className="text-white font-medium mb-2">
                    Criteria {index + 1}
                  </span>
                  <div className="p-4 rounded-lg border border-orange-400/20 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 mb-1">
                        Required Business:
                      </p>
                      <p className="text-sm text-yellow-400 mb-1">
                        ${item?.required}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 mb-1">
                        Current Business:
                      </p>
                      <p className="text-sm text-green-400 mb-1">
                        ${item?.business}
                      </p>
                    </div>
                    {currentRankDetails?.currentRank > 3 && (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400 mb-1">
                            User Criteria:
                          </p>
                          <p className="text-sm text-gray-400 mb-1">
                            {currentRankDetails?.hasPreviousRank
                              ? "Passed"
                              : "Failed"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
        {/* All Ranks Overview */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-white">Rank System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(totalRank || [])?.map((item, index) => (
                <div
                  key={item.name}
                  className={`p-4 rounded-lg border transition-all ${item.rank === currentRank
                    ? "border-coinstake-gold bg-coinstake-gold/10"
                    : item.achieved
                      ? "border-green-400 bg-green-400/5"
                      : "border-border bg-muted/20"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center relative shrink-0">
                        <Award className="h-6 w-6 text-white" />
                        {index + 1 <= Number(rank) && (
                          <CheckCircle style={{ top: 17 }} className="absolute -right-1 -bottom-1 h-4 w-4 text-green-400 bg-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white">
                            {item.rank}
                          </h3>
                          {index + 1 === Number(rank) && (
                            <Badge className="bg-coinstake-gold/20 text-coinstake-gold">
                              Current
                            </Badge>
                          )}
                          {index + 1 <= Number(rank) && (
                            <Badge className="bg-green-400/20 text-green-400">
                              Achieved
                            </Badge>
                          )}
                          {index === Number(rank) && (
                            <Badge className="bg-pink-400/20 text-pink-400">
                              In Progress
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {index + 1 < 4 
                            ? "Min: 3 Referrals" 
                            : `Min: 3 ${totalRank[index - 1]?.rank}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current Business: ${totalVolumn}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-coinstake-gold">
                        ${item.business}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Monthly: $
                        {item.bonus}{" "}
                        bonus
                      </p>
                    </div>
                  </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-4">
                    {/* Criteria 1 */}
                    <div className="p-4 rounded-lg border border-orange-400/20">
                      <span className="text-white font-medium mb-2 block">Criteria 1 (40%)</span>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-400">User</p>
                        <p className="text-sm text-gray-400">Business</p>
                        <p className="text-sm text-gray-400">Rank</p>
                        </div>
                        {(getRankWiseProgress(String(index + 1))?.part1Data || []).map((data, i) => (
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400">{data.userName}</p>
                            <p className="text-sm text-green-400">${data.business || 0}</p>
                            <p className="text-sm">{data.rank}</p>
                          </div>
                        ))}
                    </div>

                    {/* Criteria 2 */}
                    <div className="p-4 rounded-lg border border-orange-400/20">
                      <span className="text-white font-medium mb-2 block">Criteria 2 (40%)</span>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-400">User</p>
                        <p className="text-sm text-gray-400">Business</p>
                        <p className="text-sm text-gray-400">Rank</p>
                        </div>
                        {(getRankWiseProgress(String(index + 1))?.part2Data || []).map((data, i) => (
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400">{data.userName}</p>
                            <p className="text-sm text-green-400">${data.business || 0}</p>
                            <p className="text-sm">{data.rank}</p>
                          </div>
                        ))}
                    </div>

                    {/* Criteria 3 */}
                    <div className="p-4 rounded-lg border border-orange-400/20">
                      <span className="text-white font-medium mb-2 block">Criteria 3 (20%)</span>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-400">User</p>
                        <p className="text-sm text-gray-400">Business</p>
                        <p className="text-sm text-gray-400">Rank</p>
                        </div>
                        {(getRankWiseProgress(String(index + 1))?.part3Data || []).map((data, i) => (
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400">{data.userName}</p>
                            <p className="text-sm text-green-400">${data.business || 0}</p>
                            <p className="text-sm">{data.rank}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-white">
              Action Items for {nextRank} Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* {progressToNextRank.staking < 100 && ( */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-2">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-orange-400" />
                  <div>
                    <span className="text-white font-medium break-words">
                      Increase staking amount
                    </span>
                    {/* <p className="text-sm text-muted-foreground">
                        Need ${(nextRankData.required.staking - userStats.currentStaking)} more
                      </p> */}
                  </div>
                </div>
                <div className="text-end">
                  <Link to="/staking">
                    <Button size="sm" className="btn-gold">
                      Stake More
                    </Button>
                  </Link>
                </div>
              </div>
              {/* )} */}

              {/* {progressToNextRank.referrals < 100 && ( */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-blue/5 rounded-lg border border-blue/10 gap-2">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <span className="text-white font-medium break-words">
                      Refer more users
                    </span>
                    {/* <p className="text-sm text-muted-foreground">
                        Need {nextRankData.required.referrals - userStats.currentReferrals} more direct referrals
                      </p> */}
                  </div>
                </div>
                <div className="text-end">
                  <Link to="/referral">
                    <Button size="sm" className="btn-gold">
                      Start Referring
                    </Button>
                  </Link>
                </div>
              </div>
              {/* )} */}

              {/* {progressToNextRank.business < 100 && ( */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-purple/5 rounded-lg border border-purple/10 gap-2">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <div>
                    <span className="text-white font-medium break-words">
                      Build team business
                    </span>
                    {/* <p className="text-sm text-muted-foreground">
                        Need ${(nextRankData.required.business - userStats.currentBusiness)} more in team business
                      </p> */}
                  </div>
                </div>
                <div className="text-end">
                  <Link to="/teams">
                    <Button size="sm" className="btn-gold">
                      View Team
                    </Button>
                  </Link>
                </div>
              </div>
              {/* )} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RankIncome;
