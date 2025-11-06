
-- Create users table
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

-- Create admin_users table
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

-- Create staking_packages table
CREATE TABLE public.staking_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_amount DECIMAL(20,8) NOT NULL,
    max_amount DECIMAL(20,8) NOT NULL,
    reward_percentage DECIMAL(5,2) NOT NULL,
    multiplier DECIMAL(5,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_amounts CHECK (min_amount > 0 AND max_amount > min_amount),
    CONSTRAINT valid_reward CHECK (reward_percentage > 0)
);

-- Create deposits table
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

-- Create withdrawals table
CREATE TABLE public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    type VARCHAR(20) NOT NULL, -- 'rewards' or 'principal'
    amount DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) NOT NULL,
    penalty DECIMAL(20,8) DEFAULT 0,
    net_amount DECIMAL(20,8) NOT NULL,
    transaction_hash VARCHAR(66),
    status VARCHAR(20) DEFAULT 'pending',
    deposit_id UUID REFERENCES public.deposits(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_levels table
CREATE TABLE public.reward_levels (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE,
    percentage DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_level CHECK (level > 0 AND level <= 10),
    CONSTRAINT valid_percentage CHECK (percentage >= 0 AND percentage <= 100)
);

-- Create ranks table
CREATE TABLE public.ranks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rank_number INTEGER NOT NULL UNIQUE,
    min_direct_referrals INTEGER NOT NULL,
    min_staked_amount DECIMAL(20,8) NOT NULL,
    min_team_members INTEGER NOT NULL,
    rank_reward DECIMAL(20,8) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_transactions table
CREATE TABLE public.reward_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    deposit_id UUID REFERENCES public.deposits(id),
    reward_type VARCHAR(50) NOT NULL, -- 'staking', 'referral', 'rank'
    amount DECIMAL(20,8) NOT NULL,
    level INTEGER, -- for referral rewards
    from_user_id UUID REFERENCES public.users(id), -- who generated this reward
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create otp_verifications table
CREATE TABLE public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    admin_id UUID REFERENCES public.admin_users(id),
    otp_code VARCHAR(6) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'email', 'mobile', '2fa'
    purpose VARCHAR(50) NOT NULL, -- 'verification', 'login', 'password_reset'
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE public.system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean'
    description TEXT,
    updated_by UUID REFERENCES public.admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
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

-- Create referral_tree table for efficient referral tracking
CREATE TABLE public.referral_tree (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    ancestor_id UUID NOT NULL REFERENCES public.users(id),
    level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, ancestor_id, level)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for deposits
CREATE POLICY "Users can view their own deposits" ON public.deposits FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create deposits" ON public.deposits FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for withdrawals
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for reward transactions
CREATE POLICY "Users can view their own rewards" ON public.reward_transactions FOR SELECT USING (user_id = auth.uid());

-- Insert default staking packages
INSERT INTO public.staking_packages (name, min_amount, max_amount, reward_percentage) VALUES
('Bronze', 100, 1000, 5.00),
('Silver', 1001, 5000, 7.00),
('Gold', 5001, 25000, 10.00);

-- Insert default reward levels
INSERT INTO public.reward_levels (level, percentage) VALUES
(1, 10.00),
(2, 5.00),
(3, 3.00),
(4, 2.00),
(5, 1.00),
(6, 1.00),
(7, 1.00),
(8, 1.00),
(9, 1.00),
(10, 1.00);

-- Insert default ranks
INSERT INTO public.ranks (name, rank_number, min_direct_referrals, min_staked_amount, min_team_members, rank_reward) VALUES
('Starter', 1, 0, 0, 0, 0),
('Bronze', 2, 5, 1000, 10, 100),
('Silver', 3, 10, 5000, 25, 250),
('Gold', 4, 20, 15000, 50, 500),
('Platinum', 5, 50, 50000, 100, 1000),
('Diamond', 6, 100, 150000, 250, 2500),
('Elite', 7, 200, 500000, 500, 5000),
('Master', 8, 500, 1500000, 1000, 10000),
('Legend', 9, 1000, 5000000, 2500, 25000),
('Champion', 10, 2000, 15000000, 5000, 50000);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description) VALUES
('min_withdrawal_limit', '10', 'number', 'Minimum withdrawal amount in USDT'),
('withdrawal_fee_percentage', '5', 'number', 'Withdrawal fee percentage'),
('early_withdrawal_penalty', '10', 'number', 'Early withdrawal penalty percentage'),
('lock_period_months', '12', 'number', 'Principal lock period in months'),
('kyc_threshold', '10000', 'number', 'KYC required for withdrawals above this amount'),
('otp_expiry_minutes', '5', 'number', 'OTP expiry time in minutes'),
('jwt_expiry_hours', '1', 'number', 'JWT token expiry in hours'),
('rate_limit_per_minute', '100', 'number', 'API rate limit per minute'),
('max_referral_levels', '10', 'number', 'Maximum referral levels');

-- Create indexes for performance
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by ON public.users(referred_by);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX idx_deposits_status ON public.deposits(status);
CREATE INDEX idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX idx_reward_transactions_user_id ON public.reward_transactions(user_id);
CREATE INDEX idx_referral_tree_user_id ON public.referral_tree(user_id);
CREATE INDEX idx_referral_tree_ancestor_id ON public.referral_tree(ancestor_id);
CREATE INDEX idx_otp_verifications_code ON public.otp_verifications(otp_code);
CREATE INDEX idx_audit_logs_admin_id ON public.audit_logs(admin_id);

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staking_packages_updated_at BEFORE UPDATE ON public.staking_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deposits_updated_at BEFORE UPDATE ON public.deposits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_levels_updated_at BEFORE UPDATE ON public.reward_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON public.ranks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_flag BOOLEAN;
BEGIN
    LOOP
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = code) INTO exists_flag;
        IF NOT exists_flag THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update referral tree when user is created
CREATE OR REPLACE FUNCTION update_referral_tree()
RETURNS TRIGGER AS $$
DECLARE
    ancestor_record RECORD;
    current_level INTEGER := 1;
BEGIN
    -- Insert direct relationship
    IF NEW.referred_by IS NOT NULL THEN
        INSERT INTO public.referral_tree (user_id, ancestor_id, level)
        VALUES (NEW.id, NEW.referred_by, 1);
        
        -- Insert indirect relationships up to 10 levels
        FOR ancestor_record IN 
            SELECT ancestor_id, level 
            FROM public.referral_tree 
            WHERE user_id = NEW.referred_by AND level < 10
        LOOP
            INSERT INTO public.referral_tree (user_id, ancestor_id, level)
            VALUES (NEW.id, ancestor_record.ancestor_id, ancestor_record.level + 1);
        END LOOP;
        
        -- Update direct referrals count
        UPDATE public.users 
        SET direct_referrals = direct_referrals + 1 
        WHERE id = NEW.referred_by;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral tree updates
CREATE TRIGGER trigger_update_referral_tree
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_referral_tree();

-- Function to calculate business volume
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
    
    -- Add user's own deposits
    SELECT total_volume + COALESCE(SUM(amount), 0) INTO total_volume
    FROM public.deposits
    WHERE user_id = user_uuid
    AND status = 'confirmed'
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql;

-- Function to check rank eligibility
CREATE OR REPLACE FUNCTION check_rank_eligibility(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    rank_record RECORD;
    team_members INTEGER;
    business_volume DECIMAL;
    eligible_rank INTEGER := 1;
BEGIN
    SELECT * INTO user_record FROM public.users WHERE id = user_uuid;
    
    business_volume := calculate_business_volume(user_uuid);
    
    -- Count team members (all downline)
    SELECT COUNT(*) INTO team_members
    FROM public.referral_tree
    WHERE ancestor_id = user_uuid;
    
    -- Check each rank starting from highest
    FOR rank_record IN 
        SELECT * FROM public.ranks 
        WHERE is_active = true 
        ORDER BY rank_number DESC
    LOOP
        IF user_record.direct_referrals >= rank_record.min_direct_referrals
        AND user_record.total_staked >= rank_record.min_staked_amount
        AND team_members >= rank_record.min_team_members THEN
            eligible_rank := rank_record.rank_number;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN eligible_rank;
END;
$$ LANGUAGE plpgsql;
