import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@zoomswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import { usePriceZoomBusd } from '../../../state/hooks'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getZoomAddress } from '../../../utils/addressHelpers'
import useAllEarnings from '../../../hooks/useAllEarnings'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useTheme from '../../../hooks/useTheme'

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
  position: relative;
  background: ${(props) =>
    props.isActive ? 'linear-gradient(128.51deg, #553A59 -8.1%, #1C174E 109.61%, #201964 109.61%)' : ''};
  box-shadow: ${(props) => (props.isActive ? '0px 0px 20px 3px rgba(21, 19, 41, 0.5)' : '')};
  overflow: visible;
`

const StyledFarmStakingCardBody = styled(CardBody)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/zoom/earth_img.png');
  background-position: bottom right;
  background-repeat: no-repeat;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
  const { isDark } = useTheme()
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const cakeBalance = getBalanceNumber(useTokenBalance(getZoomAddress()))
  const eggPrice = usePriceZoomBusd().toNumber()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard isActive={isDark}>
      <StyledFarmStakingCardBody>
        <img
          src="/images/zoom/img_rocket.png"
          alt="img_rocket"
          style={{ position: 'absolute', right: '-1rem', top: '10px' }}
        />
        <Heading size="lg" mb="24px">
          {TranslateString(542, 'Farms & Staking')}
        </Heading>
        {/* <CardImage src="/images/egg/2.png" alt="cake logo" width={64} height={64} /> */}
        <Block>
          <Label>{TranslateString(544, 'ZM to Harvest')}</Label>
          <CakeHarvestBalance earningsSum={earningsSum} />
          <Label>~${(eggPrice * earningsSum).toFixed(2)}</Label>
        </Block>
        <Block>
          <Label>{TranslateString(546, 'ZM in Wallet')}</Label>
          <CakeWalletBalance cakeBalance={cakeBalance} />
          <Label>~${(eggPrice * cakeBalance).toFixed(2)}</Label>
        </Block>
        <Actions>
          {account ? (
            <Button
              id="harvest-all"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              fullWidth
            >
              {pendingTx
                ? TranslateString(548, 'Collecting ZM')
                : TranslateString(999, `Harvest all (${balancesWithValue.length})`)}
            </Button>
          ) : (
            <UnlockButton fullWidth />
          )}
        </Actions>
      </StyledFarmStakingCardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
