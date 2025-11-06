
# GrowmaxGlobal Technical Specification

## 1. System Overview

### 1.1 Architecture
- **Platform**: Binance Smart Chain (BSC)
- **Frontend**: React.js with TypeScript
- **Backend**: Supabase Edge Functions (Deno Runtime)
- **Database**: PostgreSQL (Supabase)
- **Blockchain**: Smart Contracts on BSC
- **Authentication**: JWT with 2FA (SMS OTP)

### 1.2 Technology Stack

#### Frontend
- React 18.3.1
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- React Query for state management
- React Router for navigation

#### Backend
- Supabase Edge Functions
- Deno Runtime
- PostgreSQL with Row Level Security (RLS)
- JWT for authentication
- Bcrypt for password hashing

#### Blockchain
- Solidity ^0.8.0
- OpenZeppelin contracts
- Hardhat for development
- BSC Mainnet/Testnet

## 2. Database Schema

### 2.1 Core Tables

#### Users Table
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    referred_by UUID REFERENCES public.users(id),
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rank_id INTEGER DEFAULT 1,
    total_staked DECIMAL(20,8) DEFAULT 0,
    total_rewards DECIMAL(20,8) DEFAULT 0,
    available_rewards DECIMAL(20,8) DEFAULT 0,
    total_withdrawn DECIMAL(20,8) DEFAULT 0,
    direct_referrals INTEGER DEFAULT 0,
    total_business DECIMAL(20,8) DEFAULT 0,
    wallet_address VARCHAR(42),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Deposits Table
```sql
CREATE TABLE public.deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    package_id INTEGER NOT NULL REFERENCES public.staking_packages(id),
    amount DECIMAL(20,8) NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    locked_until TIMESTAMP WITH TIME ZONE,
    is_principal_withdrawn BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Staking Packages Table
```sql
CREATE TABLE public.staking_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_amount DECIMAL(20,8) NOT NULL,
    max_amount DECIMAL(20,8) NOT NULL,
    reward_percentage DECIMAL(5,2) NOT NULL,
    multiplier DECIMAL(5,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Security Tables

#### Admin Users Table
```sql
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    mobile VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### OTP Verifications Table
```sql
CREATE TABLE public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    admin_id UUID REFERENCES public.admin_users(id),
    otp_code VARCHAR(6) NOT NULL,
    type VARCHAR(20) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Audit Logs Table
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admin_users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.3 Business Logic Tables

#### Referral Tree Table
```sql
CREATE TABLE public.referral_tree (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    ancestor_id UUID NOT NULL REFERENCES public.users(id),
    level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, ancestor_id, level)
);
```

#### Reward Transactions Table
```sql
CREATE TABLE public.reward_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    deposit_id UUID REFERENCES public.deposits(id),
    reward_type VARCHAR(50) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    level INTEGER,
    from_user_id UUID REFERENCES public.users(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. API Architecture

### 3.1 Edge Functions

#### Authentication Functions
- `auth-signup`: User registration with validation
- `auth-login`: Two-factor authentication
- `verify-otp`: Email/mobile verification
- `admin-login`: Admin authentication with 2FA

#### Staking Functions
- `create-deposit`: Process new staking deposits
- `withdraw-rewards`: Handle reward withdrawals
- `withdraw-principal`: Process principal withdrawals
- `process-rewards`: Monthly reward calculation

#### Data Functions
- `get-user-dashboard`: User statistics and data
- `admin-dashboard`: Admin analytics and metrics

### 3.2 Security Middleware

#### Rate Limiting
```typescript
// Rate limiting configuration
const RATE_LIMITS = {
  signup: 5, // per hour
  login: 10, // per hour
  otp: 3, // per 5 minutes
  withdrawal: 5, // per day
  general: 100 // per minute
}
```

#### Request Validation
```typescript
interface ValidationRules {
  email: RegExp // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  mobile: RegExp // /^\+?[1-9]\d{1,14}$/
  password: RegExp // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
  amount: (value: number) => value > 0
  transactionHash: RegExp // /^0x[a-fA-F0-9]{64}$/
}
```

## 4. Business Logic

### 4.1 Reward Calculation

#### Staking Rewards
```typescript
const calculateStakingReward = (amount: number, percentage: number): number => {
  return (amount * percentage) / 100 / 12 // Monthly reward
}
```

#### Referral Rewards
```typescript
const processReferralRewards = async (userId: string, baseReward: number) => {
  const rewardLevels = [10, 5, 3, 2, 1, 1, 1, 1, 1, 1] // Percentages
  
  for (let level = 1; level <= 10; level++) {
    const ancestor = await getReferralAncestor(userId, level)
    if (ancestor) {
      const reward = (baseReward * rewardLevels[level - 1]) / 100
      await creditReward(ancestor.id, reward, 'referral', level)
    }
  }
}
```

#### Rank System
```typescript
interface RankRequirement {
  rankNumber: number
  minDirectReferrals: number
  minStakedAmount: number
  minTeamMembers: number
  rankReward: number
}

const checkRankEligibility = async (userId: string): Promise<number> => {
  const user = await getUser(userId)
  const businessVolume = await calculateBusinessVolume(userId)
  const teamMembers = await getTeamMembersCount(userId)
  
  // Check each rank from highest to lowest
  for (const rank of ranks.reverse()) {
    if (
      user.directReferrals >= rank.minDirectReferrals &&
      user.totalStaked >= rank.minStakedAmount &&
      teamMembers >= rank.minTeamMembers
    ) {
      return rank.rankNumber
    }
  }
  
  return 1 // Default rank
}
```

### 4.2 Withdrawal Logic

#### Fee Calculation
```typescript
const calculateWithdrawalFees = (
  amount: number,
  type: 'rewards' | 'principal',
  isEarlyWithdrawal: boolean
) => {
  const feePercentage = 5 // 5% withdrawal fee
  const penaltyPercentage = 10 // 10% early withdrawal penalty
  
  const fee = (amount * feePercentage) / 100
  const penalty = isEarlyWithdrawal && type === 'principal' 
    ? (amount * penaltyPercentage) / 100 
    : 0
  
  return {
    fee,
    penalty,
    netAmount: amount - fee - penalty
  }
}
```

#### Validation Rules
```typescript
const validateWithdrawal = async (request: WithdrawalRequest) => {
  const user = await getUser(request.userId)
  const settings = await getSystemSettings()
  
  // Minimum amount check
  if (request.amount < settings.minWithdrawalLimit) {
    throw new Error(`Minimum withdrawal amount is $${settings.minWithdrawalLimit}`)
  }
  
  // Balance check
  if (request.type === 'rewards' && request.amount > user.availableRewards) {
    throw new Error('Insufficient rewards balance')
  }
  
  // KYC check
  if (request.amount > settings.kycThreshold && user.kycStatus !== 'approved') {
    throw new Error('KYC verification required for large withdrawals')
  }
  
  // Lock period check for principal
  if (request.type === 'principal') {
    const deposit = await getDeposit(request.depositId)
    if (new Date() < new Date(deposit.lockedUntil)) {
      throw new Error('Principal is still locked')
    }
  }
}
```

## 5. Security Implementation

### 5.1 Password Security
```typescript
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}
```

### 5.2 JWT Implementation
```typescript
const generateJWT = async (payload: any): Promise<string> => {
  const secret = new TextEncoder().encode(Deno.env.get('JWT_SECRET'))
  const jwt = await create(
    { alg: "HS256", typ: "JWT" },
    { ...payload, exp: Math.floor(Date.now() / 1000) + 3600 }, // 1 hour
    secret
  )
  return jwt
}

const verifyJWT = async (token: string): Promise<any> => {
  const secret = new TextEncoder().encode(Deno.env.get('JWT_SECRET'))
  return await verify(token, secret)
}
```

### 5.3 OTP System
```typescript
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const storeOTP = async (userId: string, otp: string, type: string, purpose: string) => {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 5) // 5 minutes
  
  await supabase.from('otp_verifications').insert({
    user_id: userId,
    otp_code: otp,
    type,
    purpose,
    expires_at: expiresAt.toISOString()
  })
}
```

### 5.4 Row Level Security (RLS)
```sql
-- Users can only view their own data
CREATE POLICY "users_own_data" ON public.users 
  FOR ALL USING (auth.uid() = id);

-- Users can only view their own deposits
CREATE POLICY "users_own_deposits" ON public.deposits 
  FOR SELECT USING (user_id = auth.uid());

-- Users can only view their own withdrawals
CREATE POLICY "users_own_withdrawals" ON public.withdrawals 
  FOR SELECT USING (user_id = auth.uid());
```

## 6. Performance Optimization

### 6.1 Database Indexes
```sql
-- Core performance indexes
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by ON public.users(referred_by);
CREATE INDEX idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX idx_deposits_status ON public.deposits(status);
CREATE INDEX idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX idx_referral_tree_ancestor_id ON public.referral_tree(ancestor_id);
CREATE INDEX idx_reward_transactions_user_id ON public.reward_transactions(user_id);
```

### 6.2 Caching Strategy
```typescript
// Cache frequently accessed data
const CACHE_DURATION = {
  systemSettings: 300, // 5 minutes
  stakingPackages: 600, // 10 minutes
  rewardLevels: 600, // 10 minutes
  userStats: 60 // 1 minute
}
```

### 6.3 Database Functions
```sql
-- Optimized business volume calculation
CREATE OR REPLACE FUNCTION calculate_business_volume(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_volume DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(d.amount), 0) INTO total_volume
    FROM public.deposits d
    JOIN public.referral_tree rt ON d.user_id = rt.user_id
    WHERE rt.ancestor_id = user_uuid
    AND d.status = 'confirmed'
    AND EXTRACT(YEAR FROM d.created_at) = EXTRACT(YEAR FROM NOW());
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql;
```

## 7. Monitoring and Logging

### 7.1 Application Logging
```typescript
const logEvent = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    data
  }))
}
```

### 7.2 Audit Trail
```typescript
const logAdminAction = async (adminId: string, action: string, data: any) => {
  await supabase.from('audit_logs').insert({
    admin_id: adminId,
    action,
    table_name: data.table,
    record_id: data.id,
    old_values: data.oldValues,
    new_values: data.newValues,
    ip_address: data.ipAddress,
    user_agent: data.userAgent
  })
}
```

### 7.3 Error Handling
```typescript
const handleError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error)
  
  // Don't expose internal errors to users
  const userMessage = error.message.includes('validation')
    ? error.message
    : 'Internal server error'
    
  return { error: userMessage }
}
```

## 8. Deployment Architecture

### 8.1 Environment Configuration
```typescript
interface EnvironmentConfig {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
  DATABASE_URL: string
  TWILIO_ACCOUNT_SID?: string
  TWILIO_AUTH_TOKEN?: string
}
```

### 8.2 CI/CD Pipeline
1. **Development**: Local Supabase instance
2. **Staging**: Supabase staging project
3. **Production**: Supabase production project

### 8.3 Database Migrations
```sql
-- Migration versioning
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW()
);
```

## 9. Testing Strategy

### 9.1 Unit Tests
```typescript
// Example test structure
describe('Reward Calculation', () => {
  test('should calculate monthly staking reward correctly', () => {
    const amount = 1000
    const percentage = 5
    const monthlyReward = calculateStakingReward(amount, percentage)
    expect(monthlyReward).toBe(41.67)
  })
})
```

### 9.2 Integration Tests
```typescript
// API endpoint testing
describe('POST /create-deposit', () => {
  test('should create deposit with valid data', async () => {
    const response = await fetch('/create-deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-id',
        packageId: 1,
        amount: 500,
        transactionHash: '0x123...'
      })
    })
    
    expect(response.status).toBe(201)
  })
})
```

### 9.3 Load Testing
- Concurrent user testing
- API endpoint stress testing
- Database performance testing
- Memory leak detection

## 10. Compliance and Security

### 10.1 Data Protection
- GDPR compliance for EU users
- Data encryption at rest and in transit
- Regular security audits
- Penetration testing

### 10.2 Financial Compliance
- AML/KYC procedures
- Transaction monitoring
- Suspicious activity reporting
- Regulatory reporting

### 10.3 Smart Contract Security
- OpenZeppelin secure contracts
- Multi-signature wallet integration
- Time-locked withdrawals
- Emergency pause functionality

---

This technical specification provides a comprehensive overview of the GrowmaxGlobal platform architecture, implementation details, and security measures. The system is designed to be scalable, secure, and compliant with industry standards.

*Last updated: June 11, 2024*
*Version: 1.0.0*
