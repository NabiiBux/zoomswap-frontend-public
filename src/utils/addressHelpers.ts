import addresses from 'config/constants/contracts'

const chainId = process.env.REACT_APP_CHAIN_ID

export const getZoomAddress = () => {
  return addresses.zoom[chainId]
}
export const getZoomAddressV1 = () => {
  return addresses.zoomV1[chainId]
}
export const getMasterChefAddress = () => {
  return addresses.masterChef[chainId]
}
export const getMasterChefV1Address = () => {
  return addresses.masterChefV1[chainId]
}
export const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId]
}
export const getWiotxAddress = () => {
  return addresses.wiotx[chainId]
}
export const getLotteryAddress = () => {
  return addresses.lottery[chainId]
}
export const getAirdropAddress = () => {
  return addresses.airdropPool[chainId]
}

export const getLotteryTicketAddress = () => {
  return addresses.lotteryNFT[chainId]
}

export const getClaimAddress = () => {
  return addresses.pointAridrop[chainId]
}
