import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  ArrowDown,
  ArrowUp,
  TrendingUp,
  Search,
  Filter,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  ChevronDown
} from 'lucide-react';

const Transactions = () => {
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const transactions = [
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      date: '2024-01-15 14:30',
      hash: '0x1234...5678',
      fee: 0.50
    },
    {
      id: 'TXN002',
      type: 'reward',
      amount: 45.20,
      status: 'completed',
      date: '2024-01-15 12:00',
      hash: '0x5678...9012',
      fee: 0
    },
    {
      id: 'TXN003',
      type: 'withdrawal',
      amount: 250,
      status: 'pending',
      date: '2024-01-14 16:45',
      hash: '0x9012...3456',
      fee: 2.50
    },
    {
      id: 'TXN004',
      type: 'referral',
      amount: 12.50,
      status: 'completed',
      date: '2024-01-14 10:20',
      hash: '0x3456...7890',
      fee: 0
    },
    {
      id: 'TXN005',
      type: 'deposit',
      amount: 500,
      status: 'failed',
      date: '2024-01-13 18:15',
      hash: '0x7890...1234',
      fee: 0.25
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4 text-green-400" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-red-400" />;
      case 'reward':
      case 'referral':
        return <TrendingUp className="h-4 w-4 text-coinstake-gold" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-400/20 text-green-400">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-orange-400/20 text-orange-400">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-400/20 text-red-400">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'All Types' || tx.type === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'All Status' || tx.status === filterStatus.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalRewards = transactions
    .filter(tx => (tx.type === 'reward' || tx.type === 'referral') && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-coinstake-black text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-coinstake-gold hover:text-coinstake-gold-dark">
            <ArrowDown className="h-5 w-5 rotate-90" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction History</h1>
            <p className="text-muted-foreground">View all your staking transactions</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-400">${totalDeposits.toLocaleString()}</p>
                </div>
                <ArrowDown className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-400">${totalWithdrawals.toLocaleString()}</p>
                </div>
                <ArrowUp className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rewards</p>
                  <p className="text-2xl font-bold text-coinstake-gold">${totalRewards.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-coinstake-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="card-glow">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-white">All Transactions</CardTitle>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search by ID or hash..." 
                    className="pl-10 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Date Range Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="btn-outline-gold">
                      <Calendar className="h-4 w-4 mr-2" />
                      {dateRange}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border">
                    {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={() => setDateRange('Last 7 days')}>
                      Last 7 days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange('Last 30 days')}>
                      Last 30 days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange('Last 90 days')}>
                      Last 90 days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange('This Year')}>
                      This Year
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Type Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="btn-outline-gold">
                      <Filter className="h-4 w-4 mr-2" />
                      {filterType}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border">
                    {/* <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={() => setFilterType('All Types')}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('Deposits')}>
                      Deposits
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('Withdrawals')}>
                      Withdrawals
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('Rewards')}>
                      Rewards
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('Referrals')}>
                      Referrals
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="btn-outline-gold">
                      <Filter className="h-4 w-4 mr-2" />
                      {filterStatus}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border">
                    {/* <DropdownMenuLabel>Transaction Status</DropdownMenuLabel>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={() => setFilterStatus('All Status')}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('Completed')}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('Pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('Failed')}>
                      Failed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Export Modal */}
                <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-white">Export Transactions</DialogTitle>
                      <DialogDescription>
                        Choose the format for your transaction export
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="btn-outline-gold">
                          Export as CSV
                        </Button>
                        <Button variant="outline" className="btn-outline-gold">
                          Export as PDF
                        </Button>
                      </div>
                      <Button className="w-full btn-gold" onClick={() => setShowExportModal(false)}>
                        Download Report
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-card rounded-lg">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white capitalize">{transaction.type}</h3>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'deposit' || transaction.type === 'reward' || transaction.type === 'referral'
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </p>
                        {transaction.fee > 0 && (
                          <p className="text-xs text-muted-foreground">Fee: ${transaction.fee}</p>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => window.open(`https://bscscan.com/tx/${transaction.hash}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="hidden md:inline">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No transactions found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
