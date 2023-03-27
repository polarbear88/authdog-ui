import request from '@/config/axios'

export const getList = (appid: number): Promise<IResponse<any>> => {
  return request.get({ url: '/developer/recharge-card/type/list?appid=' + appid })
}

export const createRechargeType = (appid: number, data: any): Promise<IResponse<any>> => {
  data.appid = appid
  return request.post({
    url: '/developer/recharge-card/type/create',
    data
  })
}

export const deleteRechargeType = (appid: number, id: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/type/delete',
    data: {
      appid,
      id
    }
  })
}

export const updateRechargeType = (appid: number, data: any): Promise<IResponse<any>> => {
  data.appid = appid
  return request.post({
    url: '/developer/recharge-card/type/update',
    data
  })
}
