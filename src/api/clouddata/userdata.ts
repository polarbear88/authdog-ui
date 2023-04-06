import request from '@/config/axios'

export const getList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/developer/userdata/list', data: where })
}

export const deleteUserData = (ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/userdata/delete',
    data: {
      ids: ids
    }
  })
}
