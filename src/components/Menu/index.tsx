import React, { useCallback, useContext } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
import { usePriceZoomBusd } from 'state/hooks'
import { Button, Menu as UikitMenu } from '@zoomswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import config from './config'
// eslint-disable-next-line import/named
import { useClaim, useUserClaim } from '../../hooks/useClaime'
import { getBalanceNumber } from '../../utils/formatBalance'
import addTokenToMetamask from '../../utils/addTokenToMetamask'
import contracts from '../../config/constants/contracts'
import { setupNetwork } from 'utils/wallet'

const Menu = (props) => {
  const { account, connect, reset } = useWallet()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const zoomPrice = usePriceZoomBusd()
  const TranslateString = useI18n()
  const userClaim = useUserClaim()
  const { onClaim } = useClaim()
  const addToMetaMask = () => {
    addTokenToMetamask({
      tokenSymbol: 'ZM',
      tokenImage: 'https://exchange.zoomswap.io/logo.png',
      tokenAddress: contracts.zoom[4689],
      tokenDecimals: 18,
    })
  }
  const handleClaim = useCallback(async () => {
    try {
      await onClaim()
    } catch (e) {
      console.error(e)
    }
  }, [onClaim])
  const links = config.map((c) => {
    // eslint-disable-next-line no-param-reassign
    c.label = TranslateString(c.translationId, c.label)
    if (c.items) {
      c.items.forEach((i) => {
        // eslint-disable-next-line no-param-reassign
        i.label = TranslateString(i.translationId, i.label)
      })
    }
    return c
  })
  return (
    <UikitMenu
      account={account}
      login={async (args) => {
        await setupNetwork()
        connect(args)
      }}
      logout={reset}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.language}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={zoomPrice}
      links={links}
      priceLink="https://www.coingecko.com/en/coins/zoomswap"
      {...props}
      userClaim={userClaim && getBalanceNumber(userClaim)}
      claim={handleClaim}
      addToMetaMask={addToMetaMask}
    />
  )
}

export default Menu
