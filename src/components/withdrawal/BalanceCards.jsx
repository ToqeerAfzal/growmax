
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Wallet, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { plateformServices } from '../../../Services/plateformServices';

const BalanceCards = ({ balances }) => {
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  
  const getUserDashboardTransections = async () => {
    let data = await plateformServices.getUserDashboardTransections()
    setTotalDeposit(data?.totalDeposit || 0)
    setTotalReward(data?.availableReward || 0)
  }

  useEffect(() => {
    getUserDashboardTransections()
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="feature-card">
        <CardContent className="p-4 text-center">
          <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">${totalReward}</h3>
          <p className="text-sm text-gray-400">Available Rewards</p>
        </CardContent>
      </Card>
      
      <Card className="feature-card">
        <CardContent className="p-4 text-center">
          <Wallet className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">${totalDeposit}</h3>
          <p className="text-sm text-gray-400">Staked Principal</p>
        </CardContent>
      </Card>
      
      <Card className="feature-card">
        <CardContent className="p-4 text-center">
          <Download className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">${(Number(totalDeposit) + Number(totalReward))}</h3>
          <p className="text-sm text-gray-400">Total Balance</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceCards;
