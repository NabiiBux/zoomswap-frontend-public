import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@zoomswap-libs/uikit'
import { CommunityTag, CoreTag, NewTag, NoFeeTag, RiskTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImages?: string[]
  tokenSymbol?: string
  isNew?: boolean
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const FarmTokenWrapper = styled.div`
  width: 64px;
  height: 64px;
  position: relative;
  display: flex;
  align-items: start;
  justify-content: center;
  background-image: url('/images/tokens/bg_token.png');
  background-size: contain;
  background-position: bottom;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImages,
  tokenSymbol,
  depositFee,
  isNew,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {/* <Image src={`/images/farms/${farmImage}.png`} alt={tokenSymbol} width={64} height={64} /> */}
      <FarmTokenWrapper>
        <img
          src={`/images/tokens/${farmImages[0]}.png`}
          alt={farmImages[0]}
          width={32}
          height={32}
          style={{ position: 'absolute', right: farmImages.length === 2 ? '30px' : '15px' }}
        />
        {farmImages.length === 2 && (
          <img
            src={`/images/tokens/${farmImages[1]}.png`}
            alt={farmImages[0]}
            width={32}
            height={32}
            style={{ position: 'absolute', left: '30px' }}
          />
        )}
      </FarmTokenWrapper>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel}</Heading>
        <Flex justifyContent="center">
          {depositFee === 0 ? <NoFeeTag /> : null}
          {isNew ? <NewTag /> : null}
          {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
          {/* <RiskTag risk={risk} /> */}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
