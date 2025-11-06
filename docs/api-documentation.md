
# GrowmaxGlobal API Documentation

## Overview
This document provides comprehensive documentation for the GrowmaxGlobal backend API built on Supabase Edge Functions.

## Base URL
All API endpoints are available at: `https://hjmazefhgwcandderxqt.supabase.co/functions/v1/`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Rate Limiting
API requests are limited to 100 requests per minute per IP address.

## Error Responses
All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Endpoints

### User Authentication

#### POST /auth-signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "mobile": "+1234567890",
  "password": "SecurePass123!",
  "referralCode": "ABC12345" // optional
}
```

**Response:**
```json
{
  "message": "Account created successfully. Please verify your email and mobile number.",
  "userId": "uuid",
  "referralCode": "ABC12345"
}
```

**Validation Rules:**
- Email: Valid email format
- Mobile: International format (+1234567890)
- Password: Min 12 chars, uppercase, lowercase, number, special character
- Referral Code: Must exist in system (if provided)

#### POST /auth-login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "otpCode": "123456" // required for second step
}
```

**Response (First Step):**
```json
{
  "message": "OTP sent to your mobile number",
  "requiresOtp": true,
  "userId": "uuid"
}
```

**Response (Second Step):**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "mobile": "+1234567890",
    "referralCode": "ABC12345",
    "rank": 1,
    "totalStaked": 1000.00,
    "availableRewards": 50.25,
    "kycStatus": "pending"
  }
}
```

#### POST /verify-otp
Verify email or mobile OTP.

**Request Body:**
```json
{
  "userId": "uuid",
  "otpCode": "123456",
  "type": "email" // or "mobile"
}
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

### Staking Operations

#### POST /create-deposit
Create a new staking deposit.

**Request Body:**
```json
{
  "userId": "uuid",
  "packageId": 1,
  "amount": 500.00,
  "transactionHash": "0x1234567890abcdef..."
}
```

**Response:**
```json
{
  "message": "Deposit created successfully. Waiting for blockchain confirmation.",
  "depositId": "uuid",
  "lockUntil": "2025-06-11T14:00:00Z"
}
```

**Validation:**
- Amount must be within package limits
- Transaction hash must be unique
- Package must be active
- Multiplier rules apply for existing users

### Withdrawal Operations

#### POST /withdraw-rewards
Withdraw available rewards.

**Request Body:**
```json
{
  "userId": "uuid",
  "amount": 100.00
}
```

**Response:**
```json
{
  "message": "Withdrawal request submitted successfully",
  "withdrawalId": "uuid",
  "amount": 100.00,
  "fee": 5.00,
  "netAmount": 95.00,
  "status": "pending"
}
```

**Validation:**
- Amount must be >= minimum withdrawal limit ($10)
- Must have sufficient rewards balance
- KYC required for amounts > $10,000

#### POST /withdraw-principal
Withdraw principal amount from deposit.

**Request Body:**
```json
{
  "userId": "uuid",
  "depositId": "uuid",
  "isEarlyWithdrawal": false // optional
}
```

**Response:**
```json
{
  "message": "Principal withdrawal request submitted successfully",
  "withdrawalId": "uuid",
  "amount": 1000.00,
  "fee": 50.00,
  "penalty": 100.00, // if early withdrawal
  "netAmount": 850.00,
  "isEarlyWithdrawal": true,
  "status": "pending"
}
```

**Validation:**
- Deposit must exist and belong to user
- Principal not already withdrawn
- Early withdrawal requires confirmation (10% penalty)

### User Dashboard

#### GET /get-user-dashboard?userId=uuid
Get comprehensive user dashboard data.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "referralCode": "ABC12345",
    "rankName": "Bronze",
    "kycStatus": "approved"
  },
  "stats": {
    "totalStaked": 1000.00,
    "availableRewards": 125.50,
    "totalRewards": 200.00,
    "totalWithdrawn": 75.00,
    "directReferrals": 5,
    "teamMembers": 25,
    "businessVolume": 15000.00
  },
  "deposits": [
    {
      "id": "uuid",
      "amount": 1000.00,
      "staking_packages": {
        "name": "Bronze",
        "reward_percentage": 5.00
      },
      "created_at": "2024-01-15T10:00:00Z",
      "locked_until": "2025-01-15T10:00:00Z"
    }
  ],
  "recentRewards": [
    {
      "reward_type": "staking",
      "amount": 41.67,
      "description": "Monthly staking reward",
      "created_at": "2024-06-01T00:00:00Z"
    }
  ],
  "pendingWithdrawals": []
}
```

### Admin Authentication

#### POST /admin-login
Admin login with 2FA.

**Request Body:**
```json
{
  "email": "admin@growmaxglobal.com",
  "password": "AdminPass123!",
  "otpCode": "123456" // required for second step
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "admin": {
    "id": "uuid",
    "email": "admin@growmaxglobal.com",
    "role": "admin",
    "mobile": "+1234567890"
  }
}
```

### Admin Dashboard

#### GET /admin-dashboard
Get admin dashboard statistics and analytics.

**Response:**
```json
{
  "stats": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "totalDeposits": 125000.00,
    "totalWithdrawals": 45000.00,
    "pendingWithdrawals": 15,
    "platformBalance": 80000.00
  },
  "packageDistribution": {
    "Bronze": {
      "count": 500,
      "volume": 45000.00
    },
    "Silver": {
      "count": 200,
      "volume": 65000.00
    },
    "Gold": {
      "count": 50,
      "volume": 15000.00
    }
  },
  "monthlyData": [
    {
      "month": "Jan 2024",
      "volume": 15000.00
    }
  ],
  "recentActivities": {
    "deposits": [],
    "withdrawals": []
  }
}
```

### Background Jobs

#### POST /process-rewards
Process monthly rewards for all users (automated cron job).

**Response:**
```json
{
  "message": "Reward processing completed successfully",
  "totalRewards": 15250.75,
  "usersProcessed": 1250
}
```

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  mobile: string
  referralCode: string
  referredBy?: string
  emailVerified: boolean
  mobileVerified: boolean
  isActive: boolean
  rankId: number
  totalStaked: number
  totalRewards: number
  availableRewards: number
  totalWithdrawn: number
  directReferrals: number
  totalBusiness: number
  walletAddress?: string
  kycStatus: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}
```

### Deposit
```typescript
interface Deposit {
  id: string
  userId: string
  packageId: number
  amount: number
  transactionHash: string
  status: 'pending' | 'confirmed' | 'failed'
  lockedUntil: string
  isPrincipalWithdrawn: boolean
  createdAt: string
  updatedAt: string
}
```

### Withdrawal
```typescript
interface Withdrawal {
  id: string
  userId: string
  type: 'rewards' | 'principal'
  amount: number
  fee: number
  penalty: number
  netAmount: number
  transactionHash?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  depositId?: string
  createdAt: string
  updatedAt: string
}
```

## Security Features

### Password Requirements
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Two-Factor Authentication
- SMS OTP for all logins
- OTP valid for 5 minutes
- Different OTP for email/mobile verification

### Rate Limiting
- 100 requests per minute per IP
- Stricter limits for sensitive operations

### Data Encryption
- AES-256 for sensitive data
- Bcrypt with salt rounds 12 for passwords
- JWT tokens with 1-hour expiry

### Audit Trail
- All admin actions logged
- IP address and user agent tracking
- Timestamp and action details

## Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| AUTH001 | Invalid credentials | Check email/password |
| AUTH002 | Account deactivated | Contact support |
| AUTH003 | OTP expired | Request new OTP |
| STAKE001 | Amount below minimum | Increase amount |
| STAKE002 | Amount above maximum | Decrease amount |
| STAKE003 | Invalid package | Select valid package |
| WITHDRAW001 | Insufficient balance | Check available balance |
| WITHDRAW002 | KYC required | Complete KYC verification |
| WITHDRAW003 | Principal locked | Wait for unlock or pay penalty |

## Webhook Events

### Deposit Confirmation
Triggered when blockchain transaction is confirmed.

```json
{
  "event": "deposit.confirmed",
  "data": {
    "depositId": "uuid",
    "userId": "uuid",
    "amount": 1000.00,
    "transactionHash": "0x..."
  }
}
```

### Withdrawal Completed
Triggered when withdrawal is processed.

```json
{
  "event": "withdrawal.completed",
  "data": {
    "withdrawalId": "uuid",
    "userId": "uuid",
    "netAmount": 95.00,
    "transactionHash": "0x..."
  }
}
```

## Testing

### Test Environment
- Base URL: `https://hjmazefhgwcandderxqt.supabase.co/functions/v1/`
- Test data available for all packages
- Mock blockchain transactions

### Sample Test Cases

#### User Registration
```bash
curl -X POST https://hjmazefhgwcandderxqt.supabase.co/functions/v1/auth-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "mobile": "+1234567890",
    "password": "TestPass123!",
    "referralCode": "REF12345"
  }'
```

#### Create Deposit
```bash
curl -X POST https://hjmazefhgwcandderxqt.supabase.co/functions/v1/create-deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "uuid",
    "packageId": 1,
    "amount": 500.00,
    "transactionHash": "0x1234567890abcdef"
  }'
```

## Support

For technical support or API questions:
- Email: api-support@growmaxglobal.com
- Documentation: https://docs.growmaxglobal.com
- Status Page: https://status.growmaxglobal.com

---

*Last updated: June 11, 2024*
*API Version: 1.0.0*
