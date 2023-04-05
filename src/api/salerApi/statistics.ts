import request from '@/config/axios'

export const getBaseStatistics = (): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/statistics/base' })
}
