import request from '@/config/axios'

export const getList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/developer/saler/list', data: where })
}

export const createSaler = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/saler/create', data })
}
