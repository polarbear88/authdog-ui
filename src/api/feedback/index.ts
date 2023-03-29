import request from '@/config/axios'

export const getList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/developer/feedback/list', data: where })
}

export const getCount = (): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/feedback/count' })
}
export const setStatus = (ids: number[], status: string): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/feedback/set-status',
    data: {
      ids,
      status
    }
  })
}
