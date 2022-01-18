import React from 'react'
import styled from 'styled-components'
import { Card, CardBody } from '@zoomswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalClaim } from 'hooks/useTickets'
import PrizesWonContent from './PrizesWonContent'
import NoPrizesContent from './NoPrizesContent'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'

const StyledCard = styled(Card)`
  ${(props) =>
    props.isDisabled
      ? `  
        margin-top: 16px;
        background-color: unset;
        box-shadow: unset;
        border: 1px solid ${props.theme.colors.textDisabled};

        ${props.theme.mediaQueries.sm} {
          margin-top: 24px;
        }

        ${props.theme.mediaQueries.lg} {
          margin-top: 32px;
        }
        `
      : ``}
`

const YourPrizesCard: React.FC = () => {
  const { claimAmount } = useTotalClaim()

  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0

  const lotteryHasDrawn = useGetLotteryHasDrawn()

  return (
    <div>
      {!lotteryHasDrawn ? (
        <></>
      ) : (
        <StyledCard isDisabled={!isAWin} isActive={isAWin}>
          <CardBody>{isAWin ? <PrizesWonContent /> : <NoPrizesContent />}</CardBody>
        </StyledCard>
      )}
    </div>
  )
}

export default YourPrizesCard
