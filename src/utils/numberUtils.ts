export class NumberUtils {
  public static allToNumber(data: any, parr: string[]) {
    for (const key of parr) {
      if (data[key]) {
        if (data[key]) {
          data[key] = Number(data[key])
        }
      }
    }
  }
}
