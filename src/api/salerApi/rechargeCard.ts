import request from '@/config/axios'

export const getAppList = (): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/recharge-card/get-app-list' })
}

export const getRechargeCardType = (appid: string): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/recharge-card/get-recharge-card-type?appid=' + appid })
}

export const getRechargeCardPrice = (appid: string, typeid: string): Promise<IResponse<any>> => {
  return request.get({
    url: '/saler/recharge-card/get-recharge-card-price?appid=' + appid + '&typeid=' + typeid
  })
}

export const createRecharge = (data: any): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/create',
    data
  })
}
