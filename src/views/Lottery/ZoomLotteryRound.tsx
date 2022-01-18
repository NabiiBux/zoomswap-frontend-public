import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@zoomswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import useTheme from '../../hooks/useTheme'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'
import { Text, useModal } from '@zoomswap-libs/uikit'
import { getLotteryIssueIndex } from 'utils/lotteryUtils'
import { useLottery } from 'hooks/useContract'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useCurrentTime } from 'hooks/useTimer'
import { getLotteryDrawTime, getTicketSaleTime } from './helpers/CountdownHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { getZoomAddress } from 'utils/addressHelpers'
import useTickets from 'hooks/useTickets'
import BuyTicketModal from './components/TicketCard/BuyTicketModal'
import PurchaseWarningModal from './components/TicketCard/PurchaseWarningModal'
import { useLotteryAllowance } from 'hooks/useAllowance'
import { useLotteryApprove } from 'hooks/useApprove'

const StyledFarmStakingCard = styled(Card)`
  min-height: 240px;
  position: relative;
  background: ${(props) =>
    props.isActive ? 'linear-gradient(128.51deg, #553A59 -8.1%, #1C174E 109.61%, #201964 109.61%)' : ''};
  box-shadow: ${(props) => (props.isActive ? '0px 0px 20px 3px rgba(21, 19, 41, 0.5)' : '')};
  overflow: visible;
  margin-bottom: 48px;
  padding: 8px 8px 0 8px;
`

const StyledFarmStakingCardBody = styled(CardBody)`
  display: flex;
  height: 100%;
  background-image: url('/images/img_lottery.png');
  background-position: 90% 20%;
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const StyledFarmStakingCardBodyLeft = styled.div`
  flex: 1;
`

const Block = styled.div``

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 18px;
  margin-bottom: 10px;
`
const TimeBox = styled.div`
  display: flex;
  margin-top: 1.5rem;
`

const Actions = styled.div`
  width: 215px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 2rem;
  }
`

const ZoomLotteryRound = () => {
  const { isDark } = useTheme()
  const { account } = useWallet()
  const TranslateString = useI18n()

  // rount and total
  const lotteryContract = useLottery()
  const lotteryPrizeAmount = +getBalanceNumber(useTotalRewards()).toFixed(0)
  const lotteryPrizeWithCommaSeparators = lotteryPrizeAmount.toLocaleString()
  const [currentLotteryNumber, setCurrentLotteryNumber] = useState(0)

  // count down
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const currentMillis = useCurrentTime()
  const timeUntilTicketSale = getTicketSaleTime(currentMillis)
  const timeUntilLotteryDraw = getLotteryDrawTime(currentMillis)

  // buy tickets
  const [requestedApproval, setRequestedApproval] = useState(false)
  const allowance = useLotteryAllowance()
  const { onApprove } = useLotteryApprove()
  const tickets = useTickets()
  const ticketsLength = tickets.length
  const cakeBalance = useTokenBalance(getZoomAddress())
  const [onPresentApprove] = useModal(<PurchaseWarningModal />)
  const [onPresentBuy] = useModal(<BuyTicketModal max={cakeBalance} tokenName="ZM" />)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      if (!txHash) {
        setRequestedApproval(false)
      }
      onPresentApprove()
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, onPresentApprove])

  const renderLotteryTicketButtons = () => {
    if (!allowance.toNumber()) {
      return (
        <>
          <Button fullWidth disabled={requestedApproval} onClick={handleApprove}>
            {TranslateString(999, 'Approve ZM')}
          </Button>
        </>
      )
    }
    return (
      <>
        <Button id="lottery-buy-start" fullWidth onClick={onPresentBuy}>
          {TranslateString(430, 'Buy ticket')}
        </Button>
      </>
    )
  }

  useEffect(() => {
    // current round
    const getInitialLotteryIndex = async () => {
      const index = await getLotteryIssueIndex(lotteryContract)

      setCurrentLotteryNumber(index)
    }

    if (account && lotteryContract) {
      getInitialLotteryIndex()
    }
  }, [account, lotteryContract])

  console.log('currentLotteryNumberxxx', currentLotteryNumber, lotteryPrizeWithCommaSeparators)

  return (
    <StyledFarmStakingCard isActive={isDark}>
      <StyledFarmStakingCardBody>
        <StyledFarmStakingCardBodyLeft>
          <Heading size="lg" mb="30px">
            Zoom Lottery Round {Number(currentLotteryNumber) > 0 ? `#${currentLotteryNumber}` : ''}
          </Heading>
          <Block>
            <Label>{TranslateString(999, 'Total Pot')}</Label>
            <Heading size="xl">{lotteryPrizeWithCommaSeparators} ZM</Heading>
            <TimeBox>
              <Text color="fourth">{lotteryHasDrawn ? timeUntilTicketSale : timeUntilLotteryDraw}</Text>
              <Text color="black60" style={{ marginLeft: '5px' }}>
                {lotteryHasDrawn ? TranslateString(0, 'Until ticket sale') : TranslateString(0, 'Until lottery draw')}
              </Text>
            </TimeBox>
          </Block>
        </StyledFarmStakingCardBodyLeft>
        <Actions>
          {account ? (
            lotteryHasDrawn ? (
              <Button disabled> {TranslateString(999, 'On sale soon')}</Button>
            ) : (
              renderLotteryTicketButtons()
            )
          ) : (
            <UnlockButton fullWidth />
          )}
          <a href="/lottery">
            <Text style={{ textAlign: 'center', marginTop: '1rem' }} color="fourth">
              Learn More &gt;&gt;
            </Text>
          </a>
        </Actions>
      </StyledFarmStakingCardBody>
    </StyledFarmStakingCard>
  )
}

export default ZoomLotteryRound
