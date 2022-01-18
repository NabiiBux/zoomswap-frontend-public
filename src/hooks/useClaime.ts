import { useCallback, useEffect, useState } from 'react'
import pointAirdropABI from 'config/abi/pointAirdrop.json'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getClaimAddress } from '../utils/addressHelpers'
import useRefresh from './useRefresh'
import useContract from './useContract'

export const useUserClaim = () => {
  const [userClaim, setUserClaim] = useState<BigNumber>()
  const { slowRefresh } = useRefresh()
  const { account }: { account: string } = useWallet()
  const claimContract = useContract(pointAirdropABI as any, getClaimAddress())

  useEffect(() => {
    async function fetchClaim() {
      if (account) {
        const res = await claimContract.methods.getClaimable(account).call()
        setUserClaim(new BigNumber(res))
      }
    }

    fetchClaim()
  }, [account, slowRefresh, claimContract])

  return userClaim
}

export const useClaim = () => {
  const { account }: { account: string } = useWallet()
  const claimContract = useContract(pointAirdropABI as any, getClaimAddress())
  const handleClaim = useCallback(async () => {
    try {
      await claimContract.methods.claim().send({ from: account })
      return true
    } catch (e) {
      return false
    }
  }, [account, claimContract])

  return { onClaim: handleClaim }
}
