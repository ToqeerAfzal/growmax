
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  ArrowUp, 
  TrendingUp, 
  Users, 
  Target,
  CheckCircle,
  Clock,
  ArrowDown
} from 'lucide-react';

const RankProgress = () => {
  const [currentRank] = useState('Silver');
  const [nextRank] = useState('Gold');
  const [progress] = useState(76);

  const ranks = [
    { name: 'Bronze', color: 'bg-amber-600', required: { staking: 1000, referrals: 5 }, rewards: 50 },
    { name: 'Silver', color: 'bg-gray-400', required: { staking: 5000, referrals: 15 }, rewards: 200 },
    { name: 'Gold', color: 'bg-coinstake-gold', required: { staking: 15000, referrals: 30 }, rewards: 500 },
    { name: 'Platinum', color: 'bg-blue-400', required: { staking: 50000, referrals: 50 }, rewards: 1500 },
    { name: 'Diamond', color: 'bg-purple-400', required: { staking: 100000, referrals: 100 }, rewards: 5000 }
  ];

  const achievements = [
    { title: 'First Stake', description: 'Complete your first staking transaction', completed: true },
    { title: 'Referral Master', description: 'Refer 10 new users', completed: true },
    { title: 'Volume Trader', description: 'Reach $10,000 in staking volume', completed: false },
    { title: 'Community Builder', description: 'Build a network of 50 active referrals', completed: false }
  ];

  return (
    <div className="min-h-screen bg-coinstake-black text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-coinstake-gold hover:text-coinstake-gold-dark">
            <ArrowDown className="h-5 w-5 rotate-90" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Rank Progress</h1>
            <p className="text-muted-foreground">Track your journey to the next rank</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Rank Status */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Award className="h-6 w-6 text-coinstake-gold" />
              <span>Current Rank: {currentRank}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentRank} Member</h3>
                    <p className="text-muted-foreground">Next: {nextRank} Rank</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-coinstake-gold">{progress}%</p>
                  <p className="text-sm text-muted-foreground">Progress to {nextRank}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to {nextRank}</span>
                  <span className="text-white">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-muted-foreground">Staking Requirement</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">$5,000 / $15,000</span>
                    <Badge variant="secondary" className="bg-green-400/20 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-muted-foreground">Referral Requirement</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">23 / 30</span>
                    <Badge variant="secondary" className="bg-orange-400/20 text-orange-400">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rank Overview */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">All Ranks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ranks.map((rank, index) => (
                <div 
                  key={rank.name}
                  className={`p-4 rounded-lg border transition-all ${
                    rank.name === currentRank 
                      ? 'border-coinstake-gold bg-coinstake-gold/10' 
                      : 'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${rank.color} rounded-full flex items-center justify-center`}>
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{rank.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${rank.required.staking.toLocaleString()} staked • {rank.required.referrals} referrals
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-coinstake-gold">${rank.rewards}</p>
                      <p className="text-xs text-muted-foreground">Monthly Reward</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.completed 
                      ? 'border-green-400 bg-green-400/10' 
                      : 'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      achievement.completed ? 'bg-green-400' : 'bg-muted'
                    }`}>
                      {achievement.completed ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">Next Steps to {nextRank}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-coinstake-gold" />
                  <span className="text-white">Refer 7 more users</span>
                </div>
                <Link to="/referral">
                  <Button size="sm" className="btn-gold">
                    Start Referring
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-400/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Staking requirement completed</span>
                </div>
                <Badge variant="secondary" className="bg-green-400/20 text-green-400">
                  Complete
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RankProgress;
