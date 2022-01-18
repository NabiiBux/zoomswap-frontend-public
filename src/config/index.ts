import BigNumber from 'bignumber.js/bignumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const CAKE_PER_BLOCK = new BigNumber(1)
export const BLOCKS_PER_YEAR = new BigNumber(6307200)
export const BSC_BLOCK_TIME = 5

export const CAKE_POOL_PID = 1
export const LOTTERY_PRICE = 15

export const publicConfig = {
  APIURL: 'https://iotex-mainnet.chainanalytics.org/api/v1/graphql',
}
