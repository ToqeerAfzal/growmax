import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { bsc } from 'wagmi/chains'; // ✅ Mainnet chain (id = 56)
import { useToast } from '@/hooks/use-toast';

export const useStakingWallet = () => {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const { isConnected, address } = useAccount();
  const chainId = 56;
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();

  useEffect(() => {
    setIsCorrectNetwork(chainId === Number(bsc.id)); // ✅ Ensure user is on Mainnet (56)
  }, [chainId]);

  const switchToBSC = async () => {
    try {
      await switchChain({ chainId: bsc.id }); // ✅ Mainnet
      toast({
        title: "Network Switched",
        description: "Successfully switched to BSC Mainnet ✅",
      });
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: "Network Switch Failed",
        description: "Please manually switch to BSC Mainnet in your wallet",
        variant: "destructive"
      });
    }
  };

  const checkAndSwitchNetwork = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return false;
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to BSC Mainnet to stake tokens",
        variant: "destructive"
      });
      await switchToBSC();
      return false;
    }

    return true;
  };

  return {
    isConnected,
    address,
    isCorrectNetwork,
    chainId,
    switchToBSC,
    checkAndSwitchNetwork
  };
};
