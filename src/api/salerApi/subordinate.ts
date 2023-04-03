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
