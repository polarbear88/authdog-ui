import request from '@/config/axios'

export const getBase = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/statistics/base'
  })
}

export const getLately = (type: string): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/statistics/lately?type=' + type
  })
}
