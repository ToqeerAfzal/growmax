
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, Wallet } from 'lucide-react';

const ProcessingInfo = ({ fees }) => {
  return (
    <Card className="feature-card">
      <CardHeader>
        <CardTitle className="text-white">Processing Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-white text-sm">Processing Time</p>
              <p className="text-xs text-gray-400">24-48 hours</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-white text-sm">Minimum Amount</p>
              <p className="text-xs text-gray-400">${fees.minimum} USDT</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingInfo;
