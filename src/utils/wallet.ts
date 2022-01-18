// eslint-disable-next-line import/prefer-default-export
export const setupNetwork = async () => {
  // @ts-ignore
  const provider = window.ethereum as any
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '0', 10)
    try {
      await provider.request?.({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: chainId === 4689 ? 'IoTeX Chain Mainnet' : 'IoTeX Chain Testnet',
            nativeCurrency: {
              name: 'IOTEX',
              symbol: 'IOTX',
              decimals: 18,
            },
            rpcUrls: [process.env.REACT_APP_NODE_1],
            blockExplorerUrls: ['https://iotexscan.com/'],
          },
        ],
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error("Can't setup the IoTeX network on metamask because window.ethereum is undefined")
    return false
  }
}

export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  // @ts-ignore
  const tokenAdded = await (window as WindowChain).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}
