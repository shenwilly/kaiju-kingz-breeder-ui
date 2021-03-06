import { BigNumber, constants, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useEthereum from './useEthereum'
import RWasteAbi from "../constants/abis/RWaste.json";
import { RWaste } from '../types/eth/RWaste';
import { DEFAULT_INTERVAL } from '../constants';

export function useAllowance(token: string, spender: string) {
  const { accountAddress, ethAccount, injectedProvider } = useEthereum();
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const [allowanceIsLoading, setAllowanceIsLoading] = useState(true)
  const [refreshAllowanceCount, setRefreshAllowanceCount] = useState(0)
  const [approveIsLoading, setApproveIsLoading] = useState(false)

  const approve = useCallback(
    async (amount?: BigNumber) => {
      if (!ethAccount || !injectedProvider || !spender || !token) {
        return;
      }

      const approveAmount = amount ? amount : constants.MaxUint256;
    
      setApproveIsLoading(true);
      try {
        const erc20 = (new ethers.Contract(token, RWasteAbi, ethAccount)) as RWaste;
        const tx = await erc20.approve(spender, approveAmount);
        await tx.wait();
        setApproveIsLoading(false);
      } catch (e) {
        setApproveIsLoading(false);
        return false;
      }
    },
    [ethAccount, injectedProvider, spender, token],
  )

  const refetchAllowance = useCallback(() => {
    setRefreshAllowanceCount(count => count + 1)
  }, [setRefreshAllowanceCount])

  useEffect(() => {
    async function updateBalances() {
      if (!ethAccount || !accountAddress) {
        return;
      }
      
      const erc20 = (new ethers.Contract(token, RWasteAbi, ethAccount)) as RWaste;
      const balances = await erc20.allowance(accountAddress, spender);
      
      setAllowanceIsLoading(false);
      setAllowance(balances);
    }
    updateBalances()
    const interval = setInterval(updateBalances, DEFAULT_INTERVAL)
    return () => clearInterval(interval)
  }, [ethAccount, token, accountAddress, refreshAllowanceCount, spender])

  return { approve, approveIsLoading, allowance, allowanceIsLoading, refetchAllowance }
}
