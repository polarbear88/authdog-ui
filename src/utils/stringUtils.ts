export class StringUtils {
  public static deleteObjectEmptyProperty(data: any) {
    const obj = { ...data }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key]
        if (element === null || element === undefined || element === '') {
          delete obj[key]
        }
      }
    }
    return obj
  }
}
