import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/NavBar';
import UserTreeModal from '@/components/UserTreeModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  Filter,
  ChevronDown,
  ArrowDown,
  TrendingUp,
  Award
} from 'lucide-react';

const ReferralTree = () => {
  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState('All Ranks');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock referral data by levels
  const referralData = {
    'Level 1': [
      {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@email.com',
        investmentAmount: 15000,
        joinDate: '2024-01-15',
        totalWithdrawn: 2500,
        directUsers: 5,
        totalBusiness: 45000,
        rank: 'Gold',
        status: 'Active'
      },
      {
        id: 2,
        username: 'jane_smith',
        email: 'jane.smith@email.com',
        investmentAmount: 8000,
        joinDate: '2024-02-20',
        totalWithdrawn: 1200,
        directUsers: 3,
        totalBusiness: 25000,
        rank: 'Silver',
        status: 'Active'
      },
      {
        id: 3,
        username: 'mike_wilson',
        email: 'mike.wilson@email.com',
        investmentAmount: 3500,
        joinDate: '2024-03-10',
        totalWithdrawn: 500,
        directUsers: 2,
        totalBusiness: 8500,
        rank: 'Bronze',
        status: 'Active'
      }
    ],
    'Level 2': [
      {
        id: 4,
        username: 'sarah_jones',
        email: 'sarah.jones@email.com',
        investmentAmount: 5000,
        joinDate: '2024-01-28',
        totalWithdrawn: 800,
        directUsers: 4,
        totalBusiness: 18000,
        rank: 'Silver',
        status: 'Active'
      },
      {
        id: 5,
        username: 'david_brown',
        email: 'david.brown@email.com',
        investmentAmount: 2500,
        joinDate: '2024-02-15',
        totalWithdrawn: 300,
        directUsers: 1,
        totalBusiness: 5000,
        rank: 'Bronze',
        status: 'Active'
      }
    ],
    'Level 3': [
      {
        id: 6,
        username: 'lisa_white',
        email: 'lisa.white@email.com',
        investmentAmount: 1500,
        joinDate: '2024-03-05',
        totalWithdrawn: 150,
        directUsers: 2,
        totalBusiness: 3500,
        rank: 'Bronze',
        status: 'Active'
      }
    ]
  };

  const getRankBadge = (rank) => {
    const colors = {
      'Gold': 'bg-amber-400/20 text-amber-400',
      'Silver': 'bg-gray-400/20 text-gray-400',
      'Bronze': 'bg-orange-400/20 text-orange-400',
      'Platinum': 'bg-blue-400/20 text-blue-400'
    };
    return <Badge className={colors[rank] || 'bg-gray-400/20 text-gray-400'}>{rank}</Badge>;
  };

  const currentLevelData = referralData[selectedLevel] || [];
  
  const filteredUsers = currentLevelData.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = rankFilter === 'All Ranks' || user.rank === rankFilter;
    
    return matchesSearch && matchesRank;
  });

  const totalStats = {
    totalUsers: Object.values(referralData).flat().length,
    totalBusiness: Object.values(referralData).flat().reduce((sum, user) => sum + user.totalBusiness, 0),
    totalInvestment: Object.values(referralData).flat().reduce((sum, user) => sum + user.investmentAmount, 0)
  };

  const handleUserClick = (user) => {
    console.log('User clicked:', user);
    setSelectedUser(user);
    setIsModalOpen(true);
    console.log('Modal should open now');
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-gold-text">Referral Tree</h1>
          <p className="text-gray-400 mt-1">View your complete referral network</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Network</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Business</p>
                  <p className="text-2xl font-bold text-primary">${totalStats.totalBusiness.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Investment</p>
                  <p className="text-2xl font-bold text-green-400">${totalStats.totalInvestment.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-foreground">Filter Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Level Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto btn-outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedLevel}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  {/* <DropdownMenuLabel>Select Level</DropdownMenuLabel>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem onClick={() => setSelectedLevel('Level 1')}>
                    Level 1 ({referralData['Level 1']?.length || 0} users)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLevel('Level 2')}>
                    Level 2 ({referralData['Level 2']?.length || 0} users)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLevel('Level 3')}>
                    Level 3 ({referralData['Level 3']?.length || 0} users)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Rank Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto btn-outline">
                    <Award className="h-4 w-4 mr-2" />
                    {rankFilter}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                  {/* <DropdownMenuLabel>Filter by Rank</DropdownMenuLabel>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem onClick={() => setRankFilter('All Ranks')}>
                    All Ranks
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRankFilter('Bronze')}>
                    Bronze
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRankFilter('Silver')}>
                    Silver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRankFilter('Gold')}>
                    Gold
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRankFilter('Platinum')}>
                    Platinum
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="feature-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">
              {selectedLevel} Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Investment Amount</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Total Withdrawn</TableHead>
                    <TableHead>Direct Users</TableHead>
                    <TableHead>Total Business</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => {
                        console.log('Table row clicked for user:', user.username);
                        handleUserClick(user);
                      }}
                    >
                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-400">
                          ${user.investmentAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.joinDate}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-red-400">
                          ${user.totalWithdrawn.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{user.directUsers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">
                          ${user.totalBusiness.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getRankBadge(user.rank)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found in {selectedLevel} matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Tree Modal */}
        {console.log('Rendering modal with isOpen:', isModalOpen, 'selectedUser:', selectedUser)}
        <UserTreeModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default ReferralTree;
