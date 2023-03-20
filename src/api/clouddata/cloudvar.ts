import request from '@/config/axios'
import { CloudvarInfo } from '../types/CloudvarInfo'

export const getList = (): Promise<IResponse<CloudvarInfo[]>> => {
  return request.get({ url: '/developer/cloudvar/list' })
}

export const createCloudvar = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/cloudvar/create', data })
}
