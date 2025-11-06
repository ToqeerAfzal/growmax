import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
  ExternalLink
} from 'lucide-react';
import { plateformServices } from '../../Services/plateformServices';

const AllTransactions = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState('All Time');

  const [currentWPage, setCurrentWPage] = useState(1);
  const [searchWTerm, setSearchWTerm] = useState('');
  const [filterWStatus, setFilterWStatus] = useState('All Status');
  const [dateWRange, setDateWRange] = useState('All Time');

  const [allTransactions, setAllTransactions] = useState([]);
  const [allWTransactions, setAllWTransactions] = useState([]);
  const itemsPerPage = 10;
  const [stakeLoader, setStakeLoader] = useState(false);
  const [withdrawalLoader, setWithdrawalLoader] = useState(false);

  const getTransections = async () => {
    setStakeLoader(true)
    let data = await plateformServices.getTransections()
    setAllTransactions(data?.data || [])
    setStakeLoader(false)
  }
  
  const getWidthdrawlRequestData = async () => {
    setWithdrawalLoader(true)
    let data = await plateformServices.getWidthdrawlRequestData()
    setAllWTransactions(data?.data || [])
    setWithdrawalLoader(false)
  }

  useEffect(() => {
    getTransections();
    getWidthdrawlRequestData()
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'staking':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-red-400" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
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

  const filteredTransactions = Array.isArray(allTransactions)
    ? allTransactions.filter(tx => {
      const matchesStatus = filterStatus === 'All Status' || tx.status === filterStatus.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        tx.id?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        tx.hash?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        (tx.package && tx.package.toLowerCase().includes(searchTerm?.toLowerCase()));
      const now = new Date();
      const txDate = new Date(tx.date.split(' ')[0].split('-').reverse().join('-')); // convert '12-07-2025' to Date

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

      return matchesStatus && matchesSearch && matchesDate;
    })
    : [];


  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions?.slice(startIndex, endIndex);

  const filteredWTransactions = Array.isArray(allWTransactions)
    ? allWTransactions.filter(tx => {
      const matchesStatus = filterWStatus === 'All Status' || tx.status === filterWStatus.toLowerCase();
      const matchesSearch = searchWTerm === '' ||
        tx.id?.toLowerCase().includes(searchWTerm?.toLowerCase()) ||
        tx.hash?.toLowerCase().includes(searchWTerm?.toLowerCase()) ||
        tx.amount?.toLowerCase().includes(searchWTerm?.toLowerCase())

      const now = new Date();
      const txDate = new Date(tx.date.split(' ')[0].split('-').reverse().join('-')); // convert '12-07-2025' to Date

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

      return matchesStatus && matchesSearch && matchesDate;
    })
    : [];


  const totalWPages = Math.ceil(filteredWTransactions?.length / itemsPerPage);
  const startWIndex = (currentPage - 1) * itemsPerPage;
  const endWIndex = startWIndex + itemsPerPage;
  const currentWTransactions = filteredWTransactions?.slice(startWIndex, endWIndex);

  const [openTransaction, setOpenTransaction] = useState("stake");
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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

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

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8"></div> */}
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="">
            <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">All Transactions</h1>
            <p className="text-muted-foreground">View all your staking and withdrawal transactions</p>
          </div>
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {[
                { key: "stake", label: "Stake" },
                { key: "widthdraw", label: "Withdrawal" },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={openTransaction === key ? "default" : "outline"}
                  onClick={() => setOpenTransaction(key)}
                  className={`whitespace-nowrap ${openTransaction === key ? "btn-gold" : "btn-outline"
                    }`}
                >
                  <span className="text-sm sm:text-base">{label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        {openTransaction === "stake" && (
          <>
            {/* Filters */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="text-white">Filter Stake Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by ID, hash, or package..."
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
                    <DropdownMenuContent className="bg-card border-border">
                      {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                      <DropdownMenuItem onClick={() => setDateRange('All Time')}>
                        All Time
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateRange('Today')}>
                        Today
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateRange('Yesturday')}>
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

                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto btn-outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {filterStatus}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border">
                      {/* <DropdownMenuLabel>Stake Transaction Status</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                      <DropdownMenuItem onClick={() => setFilterStatus('All Status')}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('Completed')}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('Failed')}>
                        Failed
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
                  Stake Transactions ({filteredTransactions.length} total)
                </CardTitle>
              </CardHeader>
              {stakeLoader ? (
                <div className="flex justify-center items-center p-8 w-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
                </div>
              ) : 
              <CardContent>
                {currentTransactions?.length > 0 ?
                  <div className='overflow-x-auto whitespace-nowrap'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Hash</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Package/Details</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          {/* <TableHead>Action</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTransactions?.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(transaction.type)}
                                <span className="capitalize text-white">{transaction.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-mono text-sm">
                              {transaction.hash ?
                                <div className="flex items-center space-x-2">
                                  <a href={`https://bscscan.com/tx/${transaction.hash}`} target='__blank'><span className="text-primary font-mono text-sm">{`${transaction.hash?.slice(0, 6)}...${transaction.hash?.slice(-4)}`}</span></a>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(transaction.hash, "Hash Id")}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              <span className={`font-bold ${transaction.type === 'staking' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {transaction.package || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDateTime(transaction.date)}
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
              }
            </Card>
          </>
        )}
        {openTransaction === "widthdraw" && (
          <>
            {/* Filters */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="text-white">Filter Withdrawal Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by ID, hash, or package..."
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
                    <DropdownMenuContent className="bg-card border-border">
                      {/* <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                      <DropdownMenuItem onClick={() => setDateRange('All Time')}>
                        All Time
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => setDateRange('Today')}>
                        Today
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateRange('Yesturday')}>
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

                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto btn-outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {filterWStatus}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border">
                      {/* <DropdownMenuLabel>Widthdrawal Transaction Status</DropdownMenuLabel>
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
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="text-white">
                  Withdrawal Transactions ({filteredWTransactions.length} total)
                </CardTitle>
              </CardHeader>
              {withdrawalLoader ? (
              <div className="flex justify-center items-center p-8 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
              </div>
            ) : 
              <CardContent>
                {currentWTransactions?.length > 0 ?
                  <div className='overflow-x-auto whitespace-nowrap'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Hash</TableHead>
                          <TableHead>Total Withdrawal Amount</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          {/* <TableHead>Action</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentWTransactions?.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="capitalize text-white">{transaction.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-mono text-sm">
                              {transaction.id ?
                                <div className="flex items-center space-x-2">
                                  <a href={`https://bscscan.com/tx/${transaction.id}`} target='__blank'><span className="text-primary font-mono text-sm">{`${transaction.id?.slice(0, 6)}...${transaction.id?.slice(-4)}`}</span></a>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(transaction.id, "Transection Id")}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                                :
                                "NA"
                              }
                            </TableCell>
                            <TableCell>
                              <span className={`font-bold`}>
                                ${transaction.mainAmount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`font-bold ${transaction.type === 'staking' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                ${transaction.amount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`font-bold ${transaction.type === 'staking' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                ${transaction.fee.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDateTime(transaction.date)}
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
              }
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;
