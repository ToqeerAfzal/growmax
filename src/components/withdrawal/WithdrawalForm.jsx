
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Download, Loader2 } from 'lucide-react';

const WithdrawalForm = ({
  withdrawalType,
  setWithdrawalType,
  amount,
  setAmount,
  walletAddress,
  balances,
  fees,
  onWithdraw,
  walletLoader
}) => {
  const calculateFee = (withdrawAmount, type) => {
    const amount = parseFloat(withdrawAmount) || 0;
    const feePercent = type === 'rewards' ? fees.rewards : fees.principal;
    return (amount * feePercent) / 100;
  };

  const calculatePrincipleFee = () => {
    const amountData = parseFloat(amount) || 0;
    const feePercent = withdrawalType === 'rewards' ? 0 : fees.principalFee;
    return (amountData * feePercent) / 100;
  };

  return (
    <Card className="feature-card">
      <CardHeader>
        <CardTitle className="text-white">New Withdrawal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Withdrawal Type */}
        <div className="space-y-3">
          <Label className="text-gray-300">Withdrawal Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={withdrawalType === 'rewards' ? 'default' : 'outline'}
              className={withdrawalType === 'rewards' ? 'btn-gold' : 'btn-outline'}
              onClick={() => setWithdrawalType('rewards')}
            >
              Rewards Only
            </Button>
            <Button
              variant={withdrawalType === 'principal' ? 'default' : 'outline'}
              className={withdrawalType === 'principal' ? 'btn-gold' : 'btn-outline'}
              onClick={() => setWithdrawalType('principal')}
            >
              Principal
            </Button>
          </div>
        </div>

        {/* Early Withdrawal Warning */}
        {withdrawalType === 'principal' && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary">Early Withdrawal Notice</h4>
                <p className="text-sm text-primary/80 mt-1">
                  Withdrawing principal before the staking period ends incurs a 5% fee plus regular withdrawal charges.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-gray-300">Amount (USDT)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
            min={fees.minimum}
            max={withdrawalType === 'rewards' ? balances.rewards : balances.principal}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Min: ${fees.minimum}</span>
            {/* <span>Max: ${(withdrawalType === 'rewards' ? balances.rewards : balances.principal).toFixed(2)}</span> */}
          </div>
        </div>

        {/* Fee Calculation */}
        {amount && (
          <div className="p-4 bg-black/40 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Withdrawal Amount:</span>
              <span className="text-white font-medium">${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Regular Fee ({withdrawalType === 'rewards' ? fees.rewards : fees.principal}%):</span>
              <span className="text-red-400">-${calculateFee(amount, withdrawalType).toFixed(2)}</span>
            </div>
            {withdrawalType !== 'rewards' &&
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Principle Fee ({withdrawalType === 'rewards' ? 0 : fees.principalFee}%):</span>
                <span className="text-red-400">-${calculatePrincipleFee(amount, withdrawalType).toFixed(2)}</span>
              </div>
            }
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-300">You'll Receive:</span>
                <span className="text-green-400">${(parseFloat(amount) - calculateFee(amount, withdrawalType) - calculatePrincipleFee(amount, withdrawalType)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <Label htmlFor="wallet" className="text-gray-300">USDT Wallet Address</Label>
          <Input
            id="wallet"
            type="text"
            value={walletAddress}
            disabled
            // placeholder="0x... or TRC20 address"
            placeholder="Wallet address"
            className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
          />
          {/* <p className="text-xs text-gray-400">
            Ensure the address supports USDT (TRC20/ERC20)
          </p> */}
        </div>

        <Button disabled={walletLoader} onClick={onWithdraw} className="btn-gold w-full text-lg py-6">
          {walletLoader ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Withdraw Funds
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WithdrawalForm;
