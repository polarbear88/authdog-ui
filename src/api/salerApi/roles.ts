import request from '@/config/axios'

export const getList = (): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/saler-roles/list' })
}

export const createSalerRoles = (name: string): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/saler-roles/create?name=' + name })
}

export const setSalerRoleConfig = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/saler/saler-roles/set-price-config', data })
}

export const deleteSalerRoles = (id: string | number): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/saler-roles/delete?id=' + id })
}
