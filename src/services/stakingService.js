import { ethers } from 'ethers';
import stakingABI from '../abis/staking.json';
import usdtABI from '../abis/usdt.json';

// Contract addresses
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const STAKING_CONTRACT_ADDRESS = '0x1897E13753630FCCdEdc9a3080A384775BeE9295';

// Binance Testnet RPC
const BSC_TESTNET_RPC = 'https://bsc-testnet.public.blastapi.io/';

class StakingService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.usdtContract = null;
    this.stakingContract = null;
  }

  // Initialize provider and contracts
  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      this.usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        usdtABI,
        this.signer
      );
      
      this.stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        stakingABI,
        this.signer
      );
      
      return true;
    }
    throw new Error('MetaMask not found');
  }

  // Convert amount to wei (18 decimals)
  convertToWei(amount) {
    return ethers.parseUnits(amount.toString(), 18);
  }

  // Convert wei to ether
  convertFromWei(weiAmount) {
    return ethers.formatUnits(weiAmount, 18);
  }

  // Check USDT balance
  async getUSDTBalance(address) {
    try {
      const balance = await this.usdtContract.balanceOf(address);
      return this.convertFromWei(balance);
    } catch (error) {
      console.error('Error getting USDT balance:', error);
      throw error;
    }
  }

  // Check allowance for staking contract
  async getAllowance(ownerAddress) {
    try {
      const allowance = await this.usdtContract.allowance(
        ownerAddress,
        STAKING_CONTRACT_ADDRESS
      );
      return allowance;
    } catch (error) {
      console.error('Error getting allowance:', error);
      throw error;
    }
  }

  // Approve USDT spending
  async approveUSDT(amount) {
    try {
      const amountWei = this.convertToWei(amount);
      const tx = await this.usdtContract.approve(
        STAKING_CONTRACT_ADDRESS,
        amountWei
      );
      return await tx.wait();
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error;
    }
  }

  // Stake tokens
  async stakeTokens(amount) {
    try {
      const amountWei = this.convertToWei(amount);
      const tx = await this.stakingContract.deposit(amountWei);

      const receipt = await tx.wait();
console.log("receipt==================tx",receipt);
      // Find and log Deposited event arguments
      const depositedEvent = receipt.logs
        .map(log => {
          try {
            return this.stakingContract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find(parsed => parsed && parsed.name === 'Deposited');
console.log("depositedEvent===========================depositedEvent",depositedEvent);

      if (depositedEvent) {
        
        const { user, amount, timestamp } = depositedEvent.args;
        // console.log('Deposited event:', { user, amount: amount.toString(), timestamp: timestamp.toString() });
      } else {
        console.warn('Deposited event not found in transaction logs.');
      }

      return receipt;
    } catch (error) {
      console.error('Error staking tokens:', error);
      throw error;
    }
  }

  // Get user's staked balance
  async getUserStakedBalance(userAddress) {
    try {
      const balance = await this.stakingContract.getUserNetBalance(userAddress);
      return this.convertFromWei(balance);
    } catch (error) {
      console.error('Error getting staked balance:', error);
      throw error;
    }
  }

  // Complete staking process (approve + stake)
  async completeStaking(amount) {
    try {
      const userAddress = await this.signer.getAddress();
      
      // Check current allowance
      const currentAllowance = await this.getAllowance(userAddress);
      const requiredAmount = this.convertToWei(amount);
      
      let approveTx = null;
      
      // If allowance is insufficient, approve first
      if (currentAllowance < requiredAmount) {
        console.log('Approving USDT...');
        approveTx = await this.approveUSDT(amount);
        console.log('Approval successful:', approveTx.hash);
        
        // Check if approval transaction was successful
        if (approveTx.status === 0) {
          throw new Error('Approval transaction failed');
        }
      }
      
      // Stake tokens
      console.log('Staking tokens...');
      const stakeTx = await this.stakeTokens(amount);
      console.log('Staking successful:', stakeTx.hash);
      
      // Check if staking transaction was successful
      if (stakeTx.status === 0) {
        throw new Error('Staking transaction failed');
      }
      
      return {
        success: true,
        approvalHash: approveTx?.hash || null,
        stakeHash: stakeTx.hash,
        events: stakeTx.logs
      };
    } catch (error) {
      console.error('Error in complete staking process:', error);
      throw error;
    }
  }
}

export default new StakingService(); 