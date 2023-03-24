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

export const addTime = (appid: number, id: number, minutes: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/add-time',
    data: {
      appid,
      id,
      minutes
    }
  })
}

export const addBanlance = (appid: number, id: number, money: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/add-banlance',
    data: {
      appid,
      id,
      money
    }
  })
}

export const unbind = (appid: number, id: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/unbind',
    data: {
      appid,
      id
    }
  })
}

export const resetUnbindCount = (appid: number, id: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/user/reset-unbindCount',
    data: {
      appid,
      id
    }
  })
}
