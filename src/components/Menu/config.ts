import { MenuEntry } from '@zoomswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    translationId: 10008,
    icon: 'HomeIcon',
    activeIcon: 'HomeActiveIcon',
    href: '/',
  },
  {
    label: 'Trade',
    translationId: 10009,
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        translationId: 10013,
        href: 'https://exchange.zoomswap.io/',
      },
      {
        label: 'Liquidity',
        translationId: 10014,
        href: 'https://exchange.zoomswap.io/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    translationId: 10010,
    activeIcon: 'FarmActiveIcon',
    href: '/farms',
  },
  {
    label: 'Zoom Pools',
    icon: 'PoolIcon',
    // translationId: 10010,
    activeIcon: 'PoolActiveIcon',
    href: '/pools',
  },
  {
    label: 'Rocket Pools',
    icon: 'RocketIcon',
    // translationId: 10010,
    activeIcon: 'RocketActiveIcon',
    href: '/rocket-pools',
  },
  {
    label: 'Migration',
    // translationId: 10009,
    icon: 'FarmIcon',
    activeIcon: 'FarmActiveIcon',
    items: [
      {
        label: 'Migrate LP From V1',
        translationId: 10015,
        href: '/migrate',
      },
      {
        label: 'Swap ZM',
        translationId: 10015,
        href: '/swap',
      },
    ],
  },
  {
    label: 'Lottery (New)',
    icon: 'TicketIcon',
    activeIcon: 'TicketActiveIcon',
    href: '/lottery',
  },
  {
    label: 'Bridge',
    activeIcon: 'IotubeIcon',
    icon: 'IotubeIcon',
    href: 'https://iotube.org',
    translationId: 10016,
  },
  {
    label: 'Zoomswap V1',
    // translationId: 10008,
    icon: 'HomeIcon',
    activeIcon: 'HomeActiveIcon',
    href: 'https://v1.zoomswap.io',
  },
  {
    label: 'Loot',
    icon: 'LootIcon',
    disabled: true,
    href: '#',
  },
  {
    label: 'About',
    // translationId: 10009,
    icon: 'AboutIcon',
    items: [
      // {
      //   label: 'About',
      //   // icon: 'AboutIcon',
      //   translationId: 10011,
      //   // activeIcon: 'AboutIcon',
      //   href: 'https://docs.zoomswap.io',
      // },
      {
        label: 'Docs',
        // activeIcon: 'DocsIcon',
        translationId: 10012,
        // icon: 'DocsIcon',
        href: 'https://docs.zoomswap.io',
      },
      {
        label: 'Github',
        // activeIcon: 'GithubIcon',
        // icon: 'GithubIcon',
        href: 'https://github.com/zoomswap',
      },
      {
        label: 'Telegram',
        // icon: 'TelegramIcon',
        href: 'https://t.me/zoomswapgroup',
      },
    ],
  },
]

export default config
