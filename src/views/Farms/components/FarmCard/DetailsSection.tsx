import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal } from '@zoomswap-libs/uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address } from 'config/constants/types'

export interface ExpandableSectionProps {
  isTokenOnly?: boolean
  iotexScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  iotexScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
}) => {
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(316, 'Stake')}:</Text>
        <StyledLinkExternal
          href={
            isTokenOnly
              ? `https://exchange.zoomswap.io/#/swap/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              : `https://exchange.zoomswap.io/#/add/${liquidityUrlPathParts}`
          }
        >
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'Total Liquidity')}:</Text>
          <Text>{totalValueFormated}</Text>
        </Flex>
      )}
      <Flex justifyContent="flex-start">
        <Link external href={iotexScanAddress} bold={false}>
          <Text>{TranslateString(356, 'View on IoTeXScan')}</Text>
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
