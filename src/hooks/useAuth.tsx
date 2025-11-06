
import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  mobile: string;
  referralCode: string;
  rank: number;
  totalStaked: number;
  availableRewards: number;
  kycStatus: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, mobile: string, password: string, referralCode?: string) => Promise<{ success: boolean; message: string; requiresVerification?: boolean; userId?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUser: User = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  mobile: '+1234567890',
  referralCode: 'DEMO123',
  rank: 3,
  totalStaked: 5000,
  availableRewards: 750,
  kycStatus: 'verified'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (email: string, mobile: string, password: string, referralCode?: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Account created successfully! You can now log in.',
      requiresVerification: false,
      userId: 'demo-user-1'
    };
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always succeed for demo
    setUser(mockUser);
    
    return { 
      success: true, 
      message: 'Login successful', 
      user: mockUser 
    };
  };

  const signOut = async () => {
    setUser(null);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
