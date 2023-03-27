import request from '@/config/axios'

export const createRechargeCard = (appid: number, data: any): Promise<IResponse<any>> => {
  data.appid = appid
  return request.post({
    url: '/developer/recharge-card/create',
    data
  })
}
