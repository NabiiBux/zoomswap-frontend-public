import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@zoomswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import useTheme from '../../../../hooks/useTheme'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  animation: ${RainbowLight} 2s linear infinite;
  background-size: 300% 300%;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const getStyledCardBg = (isDark: boolean) => {
  return isDark
    ? 'linear-gradient(128.51deg, #553A59 -8.1%, #1C174E 109.61%, #201964 109.61%);'
    : 'linear-gradient(271.38deg, rgba(238, 42, 255, 0.05) -5.46%, rgba(255, 149, 89, 0.05) 93.3%), #FFFFFF'
}

const getStyledCardBoxShadow = (isDark: boolean) => {
  return isDark ? '0px 0px 20px 3px rgba(21, 19, 41, 0.5)' : '0px 3px 20px rgba(214, 214, 214, 0.502)'
}

const FCard = styled.div<{ isZoom: boolean; isDark: boolean }>`
  align-self: baseline;
  background: ${(props) => (props.isZoom ? getStyledCardBg(props.isDark) : props.theme.card.background)};
  border-radius: 32px;
  box-shadow: ${(props) =>
    props.isZoom
      ? getStyledCardBoxShadow(props.isDark)
      : '0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);'};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const CardText = styled(Text)`
  font-weight: 500;
  font-size: 18px;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  showMigrate?: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account, showMigrate }) => {
  // console.log(farm)
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { isDark } = useTheme()
  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImages = farm.isTokenOnly
    ? [farm.tokenSymbol.toLowerCase()]
    : [farm.tokenSymbol.toLowerCase(), farm.quoteTokenSymbol.toLowerCase()]
  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.IOTX) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ZM) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = 'ZM'
  const stakeLabel = farm.isTokenOnly
    ? `${farm.tokenSymbol.toUpperCase()}`
    : ` ${farm.tokenSymbol.toUpperCase()}/${farm.quoteTokenSymbol.toUpperCase()}`
  const farmAPY =
    farm.apy &&
    farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm
  return (
    <FCard isZoom={farm.tokenSymbol === 'ZM'} isDark={isDark}>
      {farm.showBorder && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        risk={risk}
        depositFee={farm.depositFeeBP}
        farmImages={farmImages}
        tokenSymbol={farm.tokenSymbol}
        isNew={farm.isNew}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <CardText>{TranslateString(352, 'APR')}:</CardText>
        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          {farm.apy ? (
            <>
              <ApyButton
                lpLabel={lpLabel}
                quoteTokenAdresses={quoteTokenAdresses}
                quoteTokenSymbol={quoteTokenSymbol}
                tokenAddresses={tokenAddresses}
                cakePrice={cakePrice}
                apy={farm.apy}
              />
              {farmAPY}%
            </>
          ) : (
            <Skeleton height={24} width={80} />
          )}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <CardText>{TranslateString(10006, 'Stake')}:</CardText>
        <CardText> {stakeLabel} </CardText>
      </Flex>
      <Flex justifyContent="space-between">
        <CardText>{TranslateString(318, 'Earn')}:</CardText>
        <CardText>{earnLabel}</CardText>
      </Flex>
      <Flex justifyContent="space-between">
        <CardText>{TranslateString(10001, 'Deposit Fee')}:</CardText>
        <CardText>{farm.depositFeeBP / 100}%</CardText>
      </Flex>
      <CardActionsContainer showMigrate={showMigrate} farm={farm} ethereum={ethereum} account={account} />
      {/* <Divider /> */}
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
        showText={false}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          isTokenOnly={farm.isTokenOnly}
          iotexScanAddress={
            farm.isTokenOnly
              ? `https://iotexscan.io/token/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              : `https://iotexscan.io/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
          }
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
        />
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
