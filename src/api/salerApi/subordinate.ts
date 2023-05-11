import request from '@/config/axios'

export const getList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/saler/subordinate/list', data: where })
}

export const createSaler = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/saler/subordinate/create', data })
}

export const changePasswordSaler = (id: number, password: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/subordinate/change-password',
    data: {
      id,
      password
    }
  })
}

export const setStatusSaler = (ids: number[], status: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/subordinate/set-status',
    data: {
      ids,
      status
    }
  })
}

export const fundTransfer = (id: number, amount: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/subordinate/fund-transfer',
    data: {
      id,
      amount
    }
  })
}

export const setRolesSaler = (ids: number[], roleId: number): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/subordinate/set-roles',
    data: {
      ids,
      roleId
    }
  })
}

export const setNotice = (content: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/subordinate/set-notice',
    data: {
      content
    }
  })
}

export const getNotice = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/saler/subordinate/get-notice'
  })
}
