// @ts-ignore
export default async function ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
}: {
  tokenAddress: string
  tokenSymbol: string
  tokenDecimals: number
  tokenImage: string
}) {
  // @ts-ignore
  const tokenAdded = await (window as WindowChain).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage.startsWith('http') ? tokenImage : '',
      },
    },
  })
  return tokenAdded
}
