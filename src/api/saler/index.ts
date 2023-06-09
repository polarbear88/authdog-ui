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

export const setStatusSaler = (ids: number[], status: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-status',
    data: {
      ids,
      status
    }
  })
}

export const addBalanceSaler = (
  id: number,
  amount: number,
  reason: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/add-balance',
    data: {
      id,
      amount,
      reason
    }
  })
}

export const addBalanceSalerBatch = (
  ids: number[],
  amount: number,
  reason: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/add-balance-batch',
    data: {
      ids,
      amount,
      reason
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

export const setAppsBatch = (
  ids: number[],
  apps: { id: number; name: string }[]
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-apps-batch',
    data: {
      ids,
      apps
    }
  })
}

export const setRolesSaler = (ids: number[], roleId: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-roles',
    data: {
      ids,
      roleId
    }
  })
}

export const deleteSalerBatch = (ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/delete-batch',
    data: {
      ids
    }
  })
}

export const deleteSaler = (id: number | string): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/saler/delete?id=' + id
  })
}

export const setNotice = (content: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-notice',
    data: {
      content
    }
  })
}

export const getNotice = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/saler/get-notice'
  })
}

export const setNoticeTopSaler = (content: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/saler/set-notice-topsaler',
    data: {
      content
    }
  })
}

export const getNoticeTopSaler = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/saler/get-notice-topsaler'
  })
}
