import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useEthereum from './useEthereum'
import KaijuKingzAbi from "../constants/abis/KaijuKingz.json";
import { KaijuKingz } from '../types/eth/KaijuKingz';
import { DEFAULT_INTERVAL } from '../constants';

export function useApproveKaiju(token: string, operator: string) {
  const { accountAddress, ethAccount, injectedProvider } = useEthereum();
  const [approval, setApproval] = useState(false)
  const [approvalIsLoading, setApprovalIsLoading] = useState(true)
  const [refreshApprovalCount, setRefreshApprovalCount] = useState(0)
  const [approveIsLoading, setApproveIsLoading] = useState(false)

  const approve = useCallback(
    async () => {
    if (!ethAccount || !injectedProvider || !operator || !token) {
      return;
    }

    setApproveIsLoading(true);
    try {
      const erc721 = (new ethers.Contract(token, KaijuKingzAbi, ethAccount)) as KaijuKingz;
      const tx = await erc721.setApprovalForAll(operator, true);
      
      await tx.wait();
      setApproveIsLoading(false);
    } catch (e) {
      setApproveIsLoading(false);
      return false;
    }
    },
    [ethAccount, injectedProvider, operator, token],
  )

  const refetchApproval = useCallback(() => {
    setRefreshApprovalCount(count => count + 1)
  }, [setRefreshApprovalCount])

  useEffect(() => {
    async function updateBalances() {
      const erc721 = (new ethers.Contract(token, KaijuKingzAbi, ethAccount)) as KaijuKingz;
      const approved = await erc721.isApprovedForAll(accountAddress, operator);
      
      setApprovalIsLoading(false);
      setApproval(approved);
    }
    updateBalances()
    const interval = setInterval(updateBalances, DEFAULT_INTERVAL)
    return () => clearInterval(interval)
  }, [ethAccount, token, accountAddress, refreshApprovalCount, operator])

  return { approve, approveIsLoading, approval, approvalIsLoading, refetchApproval }
}
