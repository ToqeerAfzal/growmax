
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Users,
  Search,
  Download,
  Eye,
  Edit,
  Filter,
  ChevronDown,
  MoreHorizontal,
  TreePine,
  Wallet,
  Calendar,
  ArrowDown,
  TrendingUp,
  Award
} from 'lucide-react';
import { userServices } from '../../Services/userServices';
import NavBar from '../components/NavBar';
import { plateformServices } from '../../Services/plateformServices';

const UpdatedUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [subSearchTerm, setSubSearchTerm] = useState('');
  const [subSelectedLevel, setSubSelectedLevel] = useState('Level 1');
  const [selectedRank, setSelectedRank] = useState('All Ranks');
  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  const [subSelectedRank, setSubSelectedRank] = useState('All Ranks');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showReferralTree, setShowReferralTree] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [totalTeam, setTotalTeam] = useState(0);
  const [totalVolumn, setTotalVolumn] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  const [currentSubPage, setCurrentSubPage] = useState(1);

  const [totalUser, setTotalUser] = useState([]);
  const [underUser, setUnderUser] = useState([]);
  const [teamLoader, setTeamLoader] = useState(false);
  const [treeLoader, setTreeLoader] = useState(false);

  const getUserData = async () => {
    let data = await userServices.getUserData()
    setTotalUser(data?.data || [])
  }

  const getUnderUserData = async () => {
    setTeamLoader(true)
    let data = await userServices?.getUnderUserData(selectedUser?.userId)
    setUnderUser(data?.data || [])
    setTeamLoader(false)
  }

  const getUserDashboardTransections = async () => {
    setTreeLoader(true)
    let data = await plateformServices.getUserDashboardTransections()
    setTotalReward(data?.totalCommisiion || 0)
    setTotalTeam(data?.totalTeam || 0)
    setTotalVolumn(data?.totalVolumn || 0)
    setTreeLoader(false)
  }

  useEffect(() => {
    if (selectedUser?.userId) {
      getUnderUserData();
    }
  }, [selectedUser]);

  useEffect(() => {
    getUserData();
    getUserDashboardTransections()
  }, []);

  const filteredUsers = totalUser.filter(user => {
    const matchesSearch = user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'All Levels' || user.level.toString() === selectedLevel;
    const matchesRank = selectedRank === 'All Ranks' || user.rank?.toString() === selectedRank;
    return matchesSearch && matchesRank && matchesLevel;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const filteredUnderUsers = underUser.filter(user => {
    const matchesSearch = user?.email?.toLowerCase().includes(subSearchTerm.toLowerCase());
    const matchesRank = subSelectedRank === 'All Ranks' || user.rank?.toString() === subSelectedRank;
    const matchesLevel = subSelectedLevel === 'All Levels' || user.level?.toString() === subSelectedLevel;
    return matchesSearch && matchesRank && matchesLevel;
  });

  const totalUnderPages = Math.max(1, Math.ceil(filteredUnderUsers.length / itemsPerPage));

  const safeSubPage = Math.min(Math.max(currentSubPage, 1), totalUnderPages);

  const underStartIndex = (safeSubPage - 1) * itemsPerPage;
  const underEndIndex = underStartIndex + itemsPerPage;

  const paginatedUnderUsers = filteredUnderUsers.slice(underStartIndex, underEndIndex);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleViewReferralTree = (user) => {
    setSelectedUser(user);
    setShowReferralTree(true);
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
              <h1 className="text-2xl sm:text-4xl gradient-gold-text font-bold">Team Management</h1>
              <p className="text-muted-foreground">Manage platform teams and their referral networks</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Network</p>
                  <p className="text-2xl font-bold text-foreground">{totalTeam}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Business</p>
                  <p className="text-2xl font-bold text-primary">${totalVolumn}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Reward</p>
                  <p className="text-2xl font-bold text-green-400">${totalReward}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="feature-card mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by email or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto btn-outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedLevel}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  <div className='overflow-auto h-[150px] p-1'>
                    {/* <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={() => setSelectedLevel('All Levels')}>
                      All Levels
                    </DropdownMenuItem>
                    {Array.from({ length: 18 }, (_, i) => (
                      <DropdownMenuItem key={i} onClick={() => setSelectedLevel(`Level ${i + 1}`)}>
                        Level {i + 1}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="btn-outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedRank}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  <div className='overflow-auto h-[150px] p-1'>
                    {/* <DropdownMenuLabel>Filter by Rank</DropdownMenuLabel>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={() => setSelectedRank('All Ranks')}>
                      All Ranks
                    </DropdownMenuItem>
                    {Array.from({ length: 11 }, (_, i) => (
                      <DropdownMenuItem key={i} onClick={() => setSelectedRank(`Rank ${i}`)}>
                        Rank {i}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-coinstake-gold" />
              Platform Teams ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          {teamLoader ? (
            <div className="flex justify-center items-center p-8 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
            </div>
          ) :
            <CardContent>
              {paginatedUsers?.length > 0 ?
                <div className="overflow-x-auto whitespace-nowrap">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Info</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Total Investment</TableHead>
                        <TableHead>Total Withdrawal</TableHead>
                        <TableHead>Total Business</TableHead>
                        <TableHead>Direct User</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Total Team</TableHead>
                        <TableHead>Active Package</TableHead>
                        <TableHead>View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-sm text-muted-foreground">Parent: {user.parentUser}</p>
                              <p className="text-xs text-muted-foreground">Joined: {formatDateTime(user.createdAt)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400`}>
                              {user.level}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">${user.deposit}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">${user.withdrawl}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">${user.totalVolumn}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{user.directUser}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400`}>
                              {user.rank}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{user.totalTeam}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">{user.checkActivePackage}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-2">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border">
                                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewReferralTree(user)}>
                                  <TreePine className="h-4 w-4 mr-2" />
                                  View Tree
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(i + 1)}
                              isActive={currentPage === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
                :
                <div className='flex justify-center'>No record found.</div>
              }
            </CardContent>
          }
        </Card>

        {/* User Details Modal */}
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">User Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected user
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Username</label>
                      <p className="text-white font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <p className="text-white">{selectedUser.status === "active" ? "Active" : "Inactive"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Referral Code</label>
                      <p className="text-white font-mono">{selectedUser.referralCode}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Rank</label>
                      <p className="text-white text-capitalize">{selectedUser.rank || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Join Date</label>
                      <p className="text-white">{formatDateTime(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Level</label>
                      <p className="text-white">Level {selectedUser.level}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Direct Referrals</label>
                      <p className="text-white">{selectedUser.directUser}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Staked</p>
                    <p className="text-white font-bold">${(selectedUser.deposit || 0)?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                    <p className="text-white font-bold">${(selectedUser.withdrawl || 0)?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Business</p>
                    <p className="text-white font-bold">${(selectedUser.totalVolumn || 0)?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Referral Tree Modal */}
        <Dialog open={showReferralTree} onOpenChange={() => { setShowReferralTree(false); setSubSelectedLevel("Level 1") }}>
          <DialogContent className="bg-card border-border w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-auto p-4 sm:p-6 rounded-md">
            <DialogHeader>
              <DialogTitle className="text-white text-base sm:text-lg">
                Referral Tree - {selectedUser?.username || selectedUser?.firstName}
              </DialogTitle>
              <DialogDescription>
                Complete referral network for {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Filter Controls */}
              <Card className="feature-card">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by email or username..."
                        value={subSearchTerm}
                        onChange={(e) => setSubSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto btn-outline">
                          <Filter className="h-4 w-4 mr-2" />
                          {subSelectedLevel}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border">
                        <div className='overflow-auto h-[150px] p-1'>
                          {/* <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
                          <DropdownMenuSeparator /> */}
                          <DropdownMenuItem onClick={() => setSubSelectedLevel('All Levels')}>
                            All Levels
                          </DropdownMenuItem>
                          {Array.from({ length: 18 }, (_, i) => (
                            <DropdownMenuItem key={i} onClick={() => setSubSelectedLevel(`Level ${i + 1}`)}>
                              Level {i + 1}
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="btn-outline">
                          <Filter className="h-4 w-4 mr-2" />
                          {subSelectedRank}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card border-border">
                        <div className='overflow-auto h-[150px] p-1'>
                          {/* <DropdownMenuLabel>Filter by Rank</DropdownMenuLabel>
                          <DropdownMenuSeparator /> */}
                          <DropdownMenuItem onClick={() => setSubSelectedRank('All Ranks')}>
                            All Ranks
                          </DropdownMenuItem>
                          {Array.from({ length: 11 }, (_, i) => (
                            <DropdownMenuItem key={i} onClick={() => setSubSelectedRank(`Rank ${i}`)}>
                              Rank {i}
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              {paginatedUnderUsers?.length > 0 ? (
                treeLoader ? (
                  <div className="flex justify-center items-center p-8 w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coinstake-gold"></div>
                  </div>
                ) :
                  <>
                    <div className="overflow-x-auto rounded-md">
                      <Table className="min-w-[750px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>User Info</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Total Investment</TableHead>
                            <TableHead>Total Withdrawal</TableHead>
                            <TableHead>Total Business</TableHead>
                            <TableHead>Direct User</TableHead>
                            <TableHead>Rank</TableHead>
                            <TableHead>Total Team</TableHead>
                            <TableHead>Active package</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedUnderUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-sm text-muted-foreground">Parent: {user.parentUser}</p>
                                <p className="text-xs text-muted-foreground">Joined: {formatDateTime(user.createdAt)}</p>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400 whitespace-nowrap">
                                  {user.level}
                                </span>
                              </TableCell>
                              <TableCell><p className="text-white font-medium">${user.deposit}</p></TableCell>
                              <TableCell><p className="text-white font-medium">${user.withdrawl}</p></TableCell>
                              <TableCell><p className="text-white font-medium">${user.totalVolumn}</p></TableCell>
                              <TableCell><p className="text-white font-medium">{user.directUser}</p></TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400 whitespace-nowrap">
                                  {user.rank}
                                </span>
                              </TableCell>
                              <TableCell><p className="text-white font-medium">{user.totalTeam}</p></TableCell>
                              <TableCell><p className="text-white font-medium">{user.checkActivePackage}</p></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentSubPage(Math.max(1, currentSubPage - 1))}
                              className={currentSubPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {[...Array(totalUnderPages)].map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setCurrentSubPage(i + 1)}
                                isActive={currentSubPage === i + 1}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentSubPage(Math.min(totalUnderPages, currentSubPage + 1))}
                              className={currentSubPage === totalUnderPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </>
              ) : (
                <span className="flex justify-center text-muted-foreground">No record found!</span>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UpdatedUserManagement;
