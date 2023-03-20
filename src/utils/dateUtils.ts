import moment from 'moment'

export class DateUtils {
  /**
   * 格式化日期时间
   * @param format
   * @param date
   * @returns
   */
  public static formatDateTime(date?: Date | number, format = 'yyyy-MM-DD HH:mm:ss') {
    if (!date) {
      date = new Date()
    }
    if (typeof date == 'number') {
      date = new Date(date)
    }
    return moment(date).format(format)
  }

  public static getDHMSFromMinutes(minutes: number) {
    let remainingMinutes = minutes
    const minutesInDay = 1440
    const minutesInHour = 60
    const days = Math.floor(remainingMinutes / minutesInDay)
    remainingMinutes %= minutesInDay
    const hours = Math.floor(remainingMinutes / minutesInHour)
    remainingMinutes %= minutesInHour
    return {
      days,
      hours,
      minutes: remainingMinutes
    }
  }

  public static DHMSSum(data: { days: string; hours: string; minutes: string }) {
    const { days, hours, minutes } = data
    const daysInMinutes = parseInt(days) * 1440
    const hoursInMinutes = parseInt(hours) * 60
    const minutesInMinutes = parseInt(minutes)
    return daysInMinutes + hoursInMinutes + minutesInMinutes
  }

  public static convertMinutesToFormattedTime(minutes: number) {
    let remainingMinutes = minutes

    const minutesInYear = 525600
    const minutesInMonth = 43800
    const minutesInDay = 1440
    const minutesInHour = 60

    const years = Math.floor(remainingMinutes / minutesInYear)
    remainingMinutes %= minutesInYear

    const months = Math.floor(remainingMinutes / minutesInMonth)
    remainingMinutes %= minutesInMonth

    const days = Math.floor(remainingMinutes / minutesInDay)
    remainingMinutes %= minutesInDay

    const hours = Math.floor(remainingMinutes / minutesInHour)
    remainingMinutes %= minutesInHour

    let formattedTime = ''

    if (years > 0) {
      formattedTime += `${years}年`
    }
    if (months > 0) {
      formattedTime += `${months}月`
    }
    if (days > 0) {
      formattedTime += `${days}天`
    }
    if (hours > 0) {
      formattedTime += `${hours}小时`
    }
    if (remainingMinutes > 0) {
      formattedTime += `${remainingMinutes}分`
    }

    return formattedTime
  }
}