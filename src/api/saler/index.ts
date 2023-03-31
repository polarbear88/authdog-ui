import request from '@/config/axios'

export const getList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/developer/saler/list', data: where })
}

export const createSaler = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/saler/create', data })
}

export const changePasswordSaler = (id: number, password: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/change-password',
    data: {
      id,
      password
    }
  })
}

export const setStatusPasswordSaler = (ids: number[], status: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-status',
    data: {
      ids,
      status
    }
  })
}

export const addBanlanceSaler = (id: number, amount: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/add-banlance',
    data: {
      id,
      amount
    }
  })
}

export const setApps = (
  id: number,
  apps: { id: number; name: string }[]
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-apps',
    data: {
      id,
      apps
    }
  })
}
