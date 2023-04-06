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

export const getList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/saler/recharge-card/list', data: where })
}

export const setStatus = (ids: number[], status: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/set-status',
    data: {
      ids,
      status
    }
  })
}

export const rebuild = (ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/rebuild',
    data: {
      ids
    }
  })
}

export const exportByIds = (ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/export-by-ids',
    data: {
      ids
    }
  })
}

export const exportByEligible = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({
    url: '/saler/recharge-card/export-by-eligible',
    data: where
  })
}

export const setStatusByCards = (
  appid: number,
  cards: string[],
  status: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/set-status-by-cards',
    data: {
      appid,
      cards,
      status
    }
  })
}

export const rebuildByCards = (
  appid: number,
  cards: string[],
  description: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/rebuild-by-cards',
    data: {
      appid,
      cards,
      description
    }
  })
}

export const findByCards = (appid: number, cards: string[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/recharge-card/find-by-cards',
    data: {
      appid,
      cards
    }
  })
}
