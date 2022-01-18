import getTimePeriods from 'utils/getTimePeriods'
import moment from 'moment'

// lottery draws UTC: 02:00 (10:00 SGT), 14:00 (22:00 SGT)
const lotteryDrawHoursUtc = [2, 14]

const getClosestLotteryHour = (currentHour) => {
  switch (true) {
    case currentHour < lotteryDrawHoursUtc[0] || currentHour >= lotteryDrawHoursUtc[1]:
      return lotteryDrawHoursUtc[0]
    case currentHour < lotteryDrawHoursUtc[1]:
      return lotteryDrawHoursUtc[1]
    default:
      return 0
  }
}

const getNextLotteryDrawTime = (currentMillis) => {
  // const date = new Date(currentMillis)
  // const currentHour = date.getUTCHours()
  // const nextLotteryHour = getClosestLotteryHour(currentHour)

  // // next lottery is tomorrow if the next lottery is at 2am UTC...
  // // ...and current time is between 02:00am & 23:59pm UTC
  // const nextLotteryIsTomorrow = nextLotteryHour === 2 && currentHour >= 2 && currentHour <= 23
  // let millisTimeOfNextDraw

  // if (nextLotteryIsTomorrow) {
  //   const tomorrow = new Date(currentMillis)
  //   const nextDay = tomorrow.getUTCDate() + 1
  //   tomorrow.setUTCDate(nextDay)
  //   millisTimeOfNextDraw = tomorrow.setUTCHours(nextLotteryHour, 0, 0, 0)
  // } else {
  //   millisTimeOfNextDraw = date.setUTCHours(nextLotteryHour, 0, 0, 0)
  // }

  let weekOfDay = parseInt(moment().format('E'))
  let nextMonday = moment()
    .add(7 - weekOfDay + 7 * (1 - 1) + 1, 'days')
    .format('YYYY-MM-DD')
  let nextlotteryTime = `${nextMonday} 13:00:00`

  // console.log('next_monday', weekOfDay, nextMonday, )

  return moment(nextlotteryTime).utc().valueOf()
}

// @ts-ignore
const getNextTicketSaleTime = (currentMillis) => (parseInt(currentMillis / 3600000) + 1) * 3600000
const hoursAndMinutesString = (days, hours, minutes) =>
  `${days === 0 ? '' : `${parseInt(days)}d,`} ${parseInt(hours)}h, ${parseInt(minutes)}m`

export const getTicketSaleTime = (currentMillis): string => {
  const nextTicketSaleTime = getNextTicketSaleTime(currentMillis)
  const msUntilNextTicketSale = nextTicketSaleTime - currentMillis
  const { days } = getTimePeriods(msUntilNextTicketSale / 1000)
  const { minutes } = getTimePeriods(msUntilNextTicketSale / 1000)
  const { hours } = getTimePeriods(msUntilNextTicketSale / 1000)
  return hoursAndMinutesString(days, hours, minutes)
}

export const getLotteryDrawTime = (currentMillis): string => {
  const nextLotteryDrawTime = getNextLotteryDrawTime(currentMillis)
  const msUntilLotteryDraw = nextLotteryDrawTime - currentMillis
  const { days } = getTimePeriods(msUntilLotteryDraw / 1000)
  const { minutes } = getTimePeriods(msUntilLotteryDraw / 1000)
  const { hours } = getTimePeriods(msUntilLotteryDraw / 1000)
  return hoursAndMinutesString(days, hours, minutes)
}

export const getTicketSaleStep = () => (1 / 12) * 100

export const getLotteryDrawStep = (currentMillis) => {
  const msBetweenLotteries = 43200000
  const endTime = getNextLotteryDrawTime(currentMillis)
  const msUntilLotteryDraw = endTime - currentMillis
  const percentageRemaining = (msUntilLotteryDraw / msBetweenLotteries) * 100
  return 100 - percentageRemaining
}
