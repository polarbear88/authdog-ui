import request from '@/config/axios'

export const getOnlineUserList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/developer/online-user-manager/list', data: where })
}

export const kickOnlineUser = (ids: number[]): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/online-user-manager/kick',
    data: {
      ids
    }
  })
}
