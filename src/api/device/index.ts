import request from '@/config/axios'

export const getList = (appid: number, where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  where.appid = appid
  return request.post({ url: '/developer/device/list', data: where })
}

export const addTime = (appid: number, ids: number[], minutes: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/device/add-time',
    data: {
      appid,
      ids,
      minutes
    }
  })
}

export const addBalance = (
  appid: number,
  ids: number[],
  money: number
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/device/add-balance',
    data: {
      appid,
      ids,
      money
    }
  })
}

export const setStatus = (
  appid: number,
  ids: number[],
  status: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/device/set-status',
    data: {
      appid,
      ids,
      status
    }
  })
}

export const deleteUsers = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/device/delete',
    data: {
      appid,
      ids
    }
  })
}
