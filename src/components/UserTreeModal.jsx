import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  TrendingUp,
  Award,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const UserTreeModal = ({ isOpen, onClose, selectedUser }) => {
  console.log('UserTreeModal rendered with:', { isOpen, selectedUser: selectedUser?.username });
  
  const [expandedLevels, setExpandedLevels] = useState({});

  if (!selectedUser) {
    console.log('No selected user, returning null');
    return null;
  }

  // Mock data for the selected user's referral tree
  const userTreeData = {
    'Level 1': [
      {
        id: `${selectedUser.id}_1_1`,
        username: 'alex_johnson',
        email: 'alex.johnson@email.com',
        investmentAmount: 4500,
        joinDate: '2024-01-20',
        totalWithdrawn: 600,
        directUsers: 3,
        totalBusiness: 12000,
        rank: 'Silver',
        status: 'Active'
      },
      {
        id: `${selectedUser.id}_1_2`,
        username: 'maria_garcia',
        email: 'maria.garcia@email.com',
        investmentAmount: 3200,
        joinDate: '2024-02-15',
        totalWithdrawn: 400,
        directUsers: 2,
        totalBusiness: 8500,
        rank: 'Bronze',
        status: 'Active'
      }
    ],
    'Level 2': [
      {
        id: `${selectedUser.id}_2_1`,
        username: 'robert_kim',
        email: 'robert.kim@email.com',
        investmentAmount: 2100,
        joinDate: '2024-02-28',
        totalWithdrawn: 200,
        directUsers: 1,
        totalBusiness: 3500,
        rank: 'Bronze',
        status: 'Active'
      }
    ],
    'Level 3': [
      {
        id: `${selectedUser.id}_3_1`,
        username: 'emma_taylor',
        email: 'emma.taylor@email.com',
        investmentAmount: 1800,
        joinDate: '2024-03-15',
        totalWithdrawn: 100,
        directUsers: 0,
        totalBusiness: 1800,
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

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const totalTreeStats = {
    totalUsers: Object.values(userTreeData).flat().length,
    totalBusiness: Object.values(userTreeData).flat().reduce((sum, user) => sum + user.totalBusiness, 0),
    totalInvestment: Object.values(userTreeData).flat().reduce((sum, user) => sum + user.investmentAmount, 0)
  };

  console.log('About to render Dialog with isOpen:', isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Referral Tree for {selectedUser.username}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              View the complete referral network and statistics for this user
            </DialogDescription>
          </DialogHeader>

          {/* Selected User Info */}
          <Card className="feature-card mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="font-semibold text-foreground">{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rank</p>
                  {getRankBadge(selectedUser.rank)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tree Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="stat-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tree Members</p>
                    <p className="text-xl font-bold text-foreground">{totalTreeStats.totalUsers}</p>
                  </div>
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tree Business</p>
                    <p className="text-xl font-bold text-primary">${totalTreeStats.totalBusiness.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tree Investment</p>
                    <p className="text-xl font-bold text-green-400">${totalTreeStats.totalInvestment.toLocaleString()}</p>
                  </div>
                  <Award className="h-6 w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tree Levels */}
          <div className="space-y-4">
            {Object.entries(userTreeData).map(([level, users]) => (
              <Card key={level} className="feature-card">
                <Collapsible 
                  open={expandedLevels[level] ?? true} 
                  onOpenChange={() => toggleLevel(level)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">
                          {level} ({users.length} users)
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          {expandedLevels[level] === false ? (
                            <ChevronRight className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Investment</TableHead>
                              <TableHead>Join Date</TableHead>
                              <TableHead>Withdrawn</TableHead>
                              <TableHead>Direct Users</TableHead>
                              <TableHead>Business</TableHead>
                              <TableHead>Rank</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
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
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UserTreeModal;
