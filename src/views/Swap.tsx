import React from 'react'
import CakeWalletBalance from './Home/components/CakeWalletBalance'
import { getBalanceNumber } from '../utils/formatBalance'
import useTokenBalance from '../hooks/useTokenBalance'
import { getZoomAddressV1, getZoomAddress } from '../utils/addressHelpers'
import { Button, Heading } from '@zoomswap-libs/uikit'
import { useCake, useCakeV1 } from '../hooks/useContract'
import { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import UnlockButton from '../components/UnlockButton'
import Page from '../components/layout/Page'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Input from '../components/Input'
import BalanceInput from 'components/Input/BalanceInput'
import { useDispatch } from 'react-redux'

const Swap = () => {
  const cakeBalanceRaw = useTokenBalance(getZoomAddressV1())
  const cakeBalance = getBalanceNumber(cakeBalanceRaw)
  const zoomContract = useCake()
  const zoomContractV1 = useCakeV1()

  const [amount, setAmount] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()

  const onSwap = async () => {
    const rawAmount = amount
    const allowance = await zoomContractV1.methods.allowance(account, getZoomAddress()).call()
    console.log(allowance.toString(), rawAmount.toString())
    if (rawAmount.isGreaterThan(allowance)) {
      await zoomContractV1.methods
        .approve(getZoomAddress(), ethers.constants.MaxUint256)
        .send({ from: account })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
    }
    setTimeout(() => {
      zoomContract.methods
        .swap(rawAmount.toFixed(0, 1))
        .send({ from: account })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
    }, 1000)
  }

  if (!account) {
    return (
      <Page>
        <UnlockButton mt="8px" />
      </Page>
    )
  }
  return (
    <Page>
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: 'auto', width: '500px', marginTop: '150px' }}>
          <Heading mb="10px">{`ZOOM -> ZM One-Way Swap`}</Heading>
          <div style={{ marginBottom: '6px' }}>
            Please enter the ZOOM amount and hit swap to mint ZM with 1:1 ratio. Swap is one-way. You cannot swap from
            ZM to ZOOM.
          </div>

          <BalanceInput
            onChange={(e) => {
              setAmount(new BigNumber(e.currentTarget.value).multipliedBy(1e18))
            }}
            onSelectMax={() => setAmount(cakeBalanceRaw)}
            value={amount.div(1e18).toString()}
            symbol="ZOOM"
            max={cakeBalance}
          />
          <Button onClick={onSwap}>Swap</Button>
        </div>
      </div>
    </Page>
  )
}

export default Swap
