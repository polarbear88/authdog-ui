import request from '@/config/axios'

export const getList = (appid: number, where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  where.appid = appid
  return request.post({ url: '/developer/user/list', data: where })
}

export const changePassword = (
  appid: number,
  id: number,
  password: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/change-password',
    data: {
      appid,
      id,
      password
    }
  })
}

export const addTime = (
  appid: number,
  ids: number[],
  minutes: number,
  reason: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/add-time',
    data: {
      appid,
      ids,
      minutes,
      reason
    }
  })
}

export const addBalance = (
  appid: number,
  ids: number[],
  money: number,
  reason: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/add-balance',
    data: {
      appid,
      ids,
      money,
      reason
    }
  })
}

export const unbind = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/unbind',
    data: {
      appid,
      ids
    }
  })
}

export const resetUnbindCount = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/reset-unbindCount',
    data: {
      appid,
      ids
    }
  })
}

export const setStatus = (
  appid: number,
  ids: number[],
  status: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/set-status',
    data: {
      appid,
      ids,
      status
    }
  })
}

export const deleteUsers = (appid: number, ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/delete',
    data: {
      appid,
      ids
    }
  })
}

export const getStat = (appid: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/stat',
    data: {
      appid
    }
  })
}
