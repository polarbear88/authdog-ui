import request from '@/config/axios'

export const getList = (): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/subordinate-entry-link/list' })
}

export const createEntryLink = (name: string, type: string): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/subordinate-entry-link/create?name=' + name + '&type=' + type })
}

export const deleteEntryLink = (token: string): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/subordinate-entry-link/delete?token=' + token })
}
