import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { Wallet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import WalletErrorBoundary from './WalletErrorBoundary';

const WalletConnectButton = () => {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const handleClick = async () => {
    if (isConnected) {
      await disconnectWallet();
      sessionStorage.setItem("walletReload", "true");
    } else {
      await connectWallet();
      sessionStorage.setItem("walletReload", "true");
    }
  };

  if (sessionStorage.getItem("walletReload")) {
    sessionStorage.removeItem("walletReload");
    window.location.reload();
  }

  const getTooltipText = () => {
    if (isConnected) {
      localStorage.setItem("walletAddress", JSON.stringify(address))
      return `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`;
    } else {
      localStorage.setItem("walletAddress", JSON.stringify(""))
    }
    return 'Connect Wallet';
  };

  return (
    <WalletErrorBoundary>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 rounded-full ${isConnected
                ? 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              onClick={handleClick}
            >
              <Wallet className="h-4 w-4" /> {address && `${address?.slice(0, 2)}...${address?.slice(-4)}`}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </WalletErrorBoundary>
  );
};

export default WalletConnectButton; 