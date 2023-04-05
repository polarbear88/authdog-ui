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
export const getAreaStatistics = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/statistics/user-area'
  })
}

export const getBrandStatistics = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/statistics/user-brand'
  })
}

export const getPeriodic = (type: string, time: string): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/statistics/periodic?type=' + type + '&time=' + time
  })
}

export const getUseRechargeType = (type: string): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/statistics/use-recharge-type?type=' + type
  })
}
