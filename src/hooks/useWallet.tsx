import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const { open } = useWeb3Modal();
  const { address: wagmiAddress, isConnected: wagmiIsConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsConnected(wagmiIsConnected);
    setAddress(wagmiAddress || null);
  }, [wagmiIsConnected, wagmiAddress]);

  const connectWallet = () => {
    open();
  };
  
  const disconnectWallet = () => {
    disconnect();
  };

  return {
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
  };
}; 