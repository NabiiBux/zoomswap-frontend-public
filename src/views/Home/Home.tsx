import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Card } from '@zoomswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import FarmStakingCard from './components/FarmStakingCard'
import ZoomLotteryRound from '../Lottery/ZoomLotteryRound'
import CakeStats from './components/CakeStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import TwitterCard from './components/TwitterCard'
import useTheme from '../../hooks/useTheme'
import { Link } from 'react-router-dom'

const Hero = styled.div`
  align-items: center;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()
  const { isDark } = useTheme()

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          {TranslateString(576, 'ZoomSwap V2')}
        </Heading>
        <Text>{TranslateString(578, 'Top DeFi App on IoTeX Network.')}</Text>
        <Text fontSize="22px">
          <Link to="/migrate">Please migrate your LP tokens from V1 using Migration Tool.</Link>
        </Text>
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
          <TwitterCard />
        </Cards>
        <ZoomLotteryRound />
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards>
      </div>
    </Page>
  )
}

export default Home
