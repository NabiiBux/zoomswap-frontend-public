import React from 'react'
import { Button, useWalletModal } from '@zoomswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import { setupNetwork } from 'utils/wallet'

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { connect, reset } = useWallet()
  const { onPresentConnectModal } = useWalletModal(connect, reset)

  return (
    <Button
      onClick={async () => {
        // await setupNetwork()
        // connect(args)
        onPresentConnectModal()
      }}
      {...props}
    >
      {TranslateString(292, 'Connect Wallet')}
    </Button>
  )
}

export default UnlockButton
