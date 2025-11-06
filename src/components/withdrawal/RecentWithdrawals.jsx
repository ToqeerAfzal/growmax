
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ExternalLink } from 'lucide-react';

const RecentWithdrawals = ({ withdrawalHistory }) => {
  return (
    <Card className="feature-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Withdrawals</CardTitle>
          <Link to="/all-transactions">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              See All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {withdrawalHistory?.length > 0 ?
          <div className="space-y-3">
            {withdrawalHistory?.map((withdrawal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${withdrawal.status === 'completed' ? 'bg-green-400/20' : 'bg-yellow-400/20'
                    }`}>
                    {withdrawal.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">${withdrawal.mainAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{withdrawal.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${withdrawal.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                    {withdrawal.status === "completed" ? "Completed" : "Pending"}
                  </p>
                  {withdrawal.id ? (
                    <div className="flex items-center space-x-2">
                      <a href={`https://bscscan.com/tx/${withdrawal.id}`} target='__blank'><span className="text-primary font-mono text-sm">{`${withdrawal.id?.slice(0, 6)}...${withdrawal.id?.slice(-4)}`}</span></a>
                    </div>
                  ): "NA"}
                </div>
              </div>
            ))}
          </div>
          : <div className='flex items-center justify-center'>No record found.</div>
        }
      </CardContent>
    </Card>
  );
};

export default RecentWithdrawals;
