import request from '@/config/axios'
import { CloudvarInfo } from '../types/CloudvarInfo'

export const getList = (word?: string, appid?: string): Promise<IResponse<CloudvarInfo[]>> => {
  return request.get({ url: '/developer/cloudvar/list', params: { word, appid } })
}

export const createCloudvar = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/cloudvar/create', data })
}

export const updateCloudvar = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/cloudvar/update', data })
}

export const deleteCloudvar = (id: number): Promise<IResponse<any>> => {
  return request.get({ url: '/developer/cloudvar/delete?id=' + id })
}
