import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useEthereum from './useEthereum'
import RWasteAbi from "../constants/abis/RWaste.json";
import { RWaste } from '../types/eth/RWaste';
import { DEFAULT_INTERVAL } from '../constants';

export function useBalance(token: string) {
  const { accountAddress, ethAccount } = useEthereum();
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [balanceIsLoading, setBalanceIsLoading] = useState(true)
  const [refreshBalanceCount, setRefreshBalanceCount] = useState(0)

  const refetchBalance = useCallback(() => {
    setRefreshBalanceCount(count => count + 1)
  }, [setRefreshBalanceCount])

  useEffect(() => {
    async function updateBalances() {
      if (!ethAccount || !accountAddress) {
        return;
      }
      
      const erc20 = (new ethers.Contract(token, RWasteAbi, ethAccount)) as RWaste;
      const balances = await erc20.balanceOf(accountAddress);
      
      setBalanceIsLoading(false);
      setBalance(balances);
    }
    updateBalances()
    const interval = setInterval(updateBalances, DEFAULT_INTERVAL)
    return () => clearInterval(interval)
  }, [ethAccount, token, accountAddress, refreshBalanceCount])

  return { balance, balanceIsLoading, refetchBalance }
}
