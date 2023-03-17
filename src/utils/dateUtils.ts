import moment from 'moment'

export class DateUtil {
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
}
