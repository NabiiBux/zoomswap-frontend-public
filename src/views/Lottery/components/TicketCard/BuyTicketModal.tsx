import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal } from '@zoomswap-libs/uikit'
import { getFullDisplayBalance } from 'utils/formatBalance'
import TicketInput from 'components/TicketInput'
import ModalActions from 'components/ModalActions'
import { useMultiBuyLottery, useMaxNumber } from 'hooks/useBuyLottery'
import useI18n from 'hooks/useI18n'
import { LOTTERY_PRICE } from '../../../../config/index'

interface BuyTicketModalProps {
  max: BigNumber
  onConfirm?: (amount: string, numbers: Array<number>) => void
  onDismiss?: () => void
  tokenName?: string
}

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({ max, onDismiss }) => {
  const [val, setVal] = useState('1')
  const [pendingTx, setPendingTx] = useState(false)
  const [, setRequestedBuy] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const maxTickets = useMemo(() => {
    return parseInt(getFullDisplayBalance(max.div(new BigNumber(LOTTERY_PRICE))))
  }, [max])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    let value = Number(e.currentTarget.value.replace(/\b(0+)/gi, '')).toFixed(0)
    if (Number(value) < 0) {
      setVal('0')
    } else {
      setVal(value)
    }
  }

  const { onMultiBuy } = useMultiBuyLottery()
  const maxNumber = useMaxNumber()
  const handleBuy = useCallback(async () => {
    try {
      setRequestedBuy(true)
      const length = parseInt(val)
      // @ts-ignore
      // eslint-disable-next-line prefer-spread
      const numbers = Array.apply(null, { length }).map(() => [
        Math.floor(Math.random() * maxNumber) + 1,
        Math.floor(Math.random() * maxNumber) + 1,
        Math.floor(Math.random() * maxNumber) + 1,
        Math.floor(Math.random() * maxNumber) + 1,
      ])
      const txHash = await onMultiBuy(String(LOTTERY_PRICE), numbers)
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedBuy(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onMultiBuy, setRequestedBuy, maxNumber, val])

  const handleSelectMax = useCallback(() => {
    if (Number(maxTickets) > 20) {
      setVal('20')
    } else {
      setVal(maxTickets.toString())
    }
  }, [maxTickets])

  const cakeCosts = (amount: string): number => {
    return +amount * LOTTERY_PRICE
  }
  return (
    <Modal title={TranslateString(450, 'Enter amount of tickets to buy')} onDismiss={onDismiss}>
      <TicketInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol="TICKET"
        availableSymbol="ZM"
      />

      <div>
        <Tips>Your amount must be a multiple of {LOTTERY_PRICE} Ticket</Tips>
        <Tips>1 Ticket = {LOTTERY_PRICE} ZM</Tips>
      </div>
      <div>
        <Announce>
          {TranslateString(478, 'Ticket purchases are final. Your ZM cannot be returned to you after buying tickets.')}
        </Announce>
        <Final>
          {parseInt(val) > 20
            ? parseInt(fullBalance) < 20
              ? `You can purchase at most ${Number(fullBalance).toFixed(0)} tickets.`
              : `Cannot purchase more than ${val} tickets`
            : TranslateString(460, `You will spend: ${cakeCosts(val)} ZM`)}
        </Final>
      </div>
      <ModalActions>
        <Button fullWidth onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          id="lottery-buy-complete"
          fullWidth
          disabled={
            pendingTx ||
            parseInt(val) > Number(maxTickets) ||
            parseInt(val) > 20 ||
            parseInt(val) < 1 ||
            Number(val) === 0
          }
          onClick={async () => {
            setPendingTx(true)
            await handleBuy()
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default BuyTicketModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`
const Announce = styled.div`
  margin-top: 1em;
  margin-left: 0.4em;
  color: #ed4b9e;
`
