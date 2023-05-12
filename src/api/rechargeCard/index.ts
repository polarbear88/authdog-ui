import request from '@/config/axios'

export const createRechargeCard = (appid: number, data: any): Promise<IResponse<any>> => {
  data.appid = appid
  return request.post({
    url: '/developer/recharge-card/create',
    data
  })
}

export const getList = (appid: number, where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  where.appid = appid
  return request.post({ url: '/developer/recharge-card/list', data: where })
}

export const setStatus = (
  appid: number,
  ids: number[],
  status: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/set-status',
    data: {
      appid,
      ids,
      status
    }
  })
}

export const rebuild = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/rebuild',
    data: {
      appid,
      ids
    }
  })
}

export const deleteRechargeCard = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/delete',
    data: {
      appid,
      ids
    }
  })
}

export const exportByIds = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/export-by-ids',
    data: {
      appid,
      ids
    }
  })
}

export const exportByEligible = (appid: number, where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  where.appid = appid
  return request.post({
    url: '/developer/recharge-card/export-by-eligible',
    data: where
  })
}

export const setStatusByCards = (
  appid: number,
  cards: string[],
  status: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/set-status-by-cards',
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
    url: '/developer/recharge-card/rebuild-by-cards',
    data: {
      appid,
      cards,
      description
    }
  })
}

export const deleteRechargeCardByCards = (
  appid: number,
  cards: string[]
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/delete-by-cards',
    data: {
      appid,
      cards
    }
  })
}

export const findRechargeCardByCards = (
  appid: number,
  cards: string[]
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/find-by-cards',
    data: {
      appid,
      cards
    }
  })
}

export const retrieveByCards = (
  appid: number,
  cards: string[],
  reason: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/recharge-card/retrieve-by-cards',
    data: {
      appid,
      cards,
      reason
    }
  })
}
