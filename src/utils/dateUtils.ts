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
    if (typeof date == 'number' || typeof date == 'string') {
      date = new Date(date)
    }
    return moment(date).format(format)
  }

  public static formatDateTimeAll(data: any, parr: string[], format = 'yyyy-MM-DD HH:mm:ss') {
    for (const key of parr) {
      if (data[key]) {
        data[key] = this.formatDateTime(data[key], format)
      }
    }
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
    const daysInMinutes = Number(days) * 1440
    const hoursInMinutes = Number(hours) * 60
    const minutesInMinutes = Number(minutes)
    return daysInMinutes + hoursInMinutes + minutesInMinutes
  }

  public static convertMinutesToFormattedTime(minutes: number) {
    let remainingMinutes = minutes

    const minutesInDay = 1440
    const minutesInHour = 60

    const days = Math.floor(remainingMinutes / minutesInDay)
    remainingMinutes %= minutesInDay

    const hours = Math.floor(remainingMinutes / minutesInHour)
    remainingMinutes %= minutesInHour

    let formattedTime = ''

    if (days > 0) {
      formattedTime += `${Math.floor(days)}天`
    }
    if (hours > 0) {
      formattedTime += `${Math.floor(hours)}小时`
    }
    if (remainingMinutes > 0) {
      formattedTime += `${Math.floor(remainingMinutes)}分`
    }

    return formattedTime
  }
}
