import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  Button,
  Flex,
  Heading,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
  Modal,
  CheckmarkIcon,
  Link,
  ArrowForwardIcon,
  Text,
} from '@zoomswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from '../../../../utils/formatBalance'
import useStake from '../../../../hooks/useStake'
import { useEmergencyWithdraw } from '../../../../hooks/useStake'
import { Farm } from '../../../../state/types'
import getLiquidityUrlPathParts from '../../../../utils/getLiquidityUrlPathParts'
import { getZoomAddressV1, getZoomAddress } from '../../../../utils/addressHelpers'
import addresses from 'config/constants/contracts'

interface FarmCardActionsProps {
  pid?: number
  stakedBalance?: BigNumber
  farm: Farm
  tokenBalance?: BigNumber
  tokenName?: string
  depositFeeBP?: number
  handleApprove?: any
}

const IconButtonWrapper = styled.div`
  display: flex;

  svg {
    width: 20px;
  }
`

const MigrationAction: React.FC<FarmCardActionsProps> = ({ pid, stakedBalance, handleApprove, farm, tokenBalance }) => {
  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toPrecision(6)

  const { onEmergencyWithdraw } = useEmergencyWithdraw(pid)
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
  const liquidityUrlPathPartsV1 = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses: addresses.zoomV1,
  })
  const liquidityUrlPathPartsV2 = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses: addresses.zoom,
  })

  const { onStake } = useStake(pid)

  const onWithdraw = async () => {
    await onEmergencyWithdraw()
  }

  const onEnableFarm = async () => {
    await handleApprove()
  }

  const onStakeAll = async () => {
    await onStake(tokenBalance.div(1e18).toString())
  }

  const MigrationModal = ({ onDismiss }: { onDismiss?: any }) => {
    const [stepCount, setStepCount] = React.useState(0)

    const onMigration = async () => {
      if (stepCount === 3) {
        onDismiss()
        return
      }
      try {
        const amount = stakedBalance.div(1e18).toString()
        setStepCount(0.5)
        await onEmergencyWithdraw()
        setStepCount(1)
        await handleApprove()
        setStepCount(2)
        setTimeout(async () => {
          await onStake(amount)
          setStepCount(3)
        }, 1000)
      } catch (error) {
        setStepCount(0)
      }
    }
    return (
      <Modal title={`Migrate ${farm.lpSymbol}`} onDismiss={onDismiss}>
        {farm.migrateType === 'zoomOnly' && (
          <div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>1. Withdraw from V1</Text>
              <Button
                size="sm"
                onClick={onWithdraw}
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
              >
                Withdraw
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>2. Swap ZOOM to ZM</Text>
              <Button
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
                size="sm"
                as={Link}
                href="/swap"
                external
              >
                Go Swap
                <ArrowForwardIcon ml={1} color="#6e2e8a" />
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>3. Enable Farm for V2</Text>
              <Button
                size="sm"
                onClick={onEnableFarm}
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
              >
                Enable Farm
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>4. Stake ZM to V2</Text>
              <Button
                size="sm"
                onClick={onStakeAll}
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
              >
                Stake
              </Button>
            </div>
          </div>
        )}
        {farm.migrateType === 'zoomLP' && (
          <div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>1. Withdraw LP from V1</Text>
              <Button
                size="sm"
                onClick={onWithdraw}
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
              >
                Withdraw
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>2. Remove Old ZOOM/{farm.quoteTokenSymbol} LP</Text>
              <Button
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
                as={Link}
                href={`https://exchange.zoomswap.io/#/remove/${liquidityUrlPathPartsV1}`}
                size="sm"
                external
              >
                Go Exchange
                <ArrowForwardIcon ml={1} color="#6e2e8a" />
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>3. Swap ZOOM to ZM</Text>
              <Button
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
                size="sm"
                as={Link}
                href="/swap"
                external
              >
                Go Swap
                <ArrowForwardIcon ml={1} color="#6e2e8a" />
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>4. Add New ZM/{farm.quoteTokenSymbol} LP</Text>
              <Button
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
                size="sm"
                as={Link}
                href={`https://exchange.zoomswap.io/#/add/${liquidityUrlPathPartsV2}`}
                external
              >
                Go Exchange
                <ArrowForwardIcon ml={1} color="#6e2e8a" />
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>5. Enable Farm for V2</Text>
              <Button
                size="sm"
                onClick={onEnableFarm}
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
              >
                Enable Farm
              </Button>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>6. Stake LP to V2</Text>
              <Button
                size="sm"
                onClick={onStakeAll}
                style={{
                  textDecoration: 'underline',
                  backgroundClip: 'text',
                  background: 'unset',
                  color: '#6e2e8a',
                }}
              >
                Stake
              </Button>
            </div>
          </div>
        )}
        {farm.migrateType === 'LP' && (
          <div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>1. Withdraw LP from V1</Text>
              {stepCount >= 1 && <CheckmarkIcon />}
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}
            >
              <Text>2. Enable Farm for V2</Text>
              {stepCount >= 2 && <CheckmarkIcon />}
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
              <Text>3. Stake LP to V2</Text>
              {stepCount >= 3 && <CheckmarkIcon />}
            </div>
            {
              <Button size="sm" fullWidth onClick={onMigration} disabled={stepCount !== 0 && stepCount !== 3}>
                {stepCount === 0 ? 'Start Migration' : stepCount === 3 ? 'Done' : 'Pending'}
              </Button>
            }
          </div>
        )}
      </Modal>
    )
  }

  const [onPreMigrate] = useModal(<MigrationModal />)

  const renderMigrationButton = () => {
    return <Button onClick={onPreMigrate}>Migrate</Button>
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {renderMigrationButton()}
    </Flex>
  )
}

export default MigrationAction
