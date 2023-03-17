import { ApplicationInfo } from '../types/ApplicationInfo'
import request from '@/config/axios'

export const getList = (): Promise<IResponse<ApplicationInfo[]>> => {
  return request.get({ url: '/developer/app/list' })
}

export const getDetail = (id: string): Promise<IResponse<ApplicationInfo>> => {
  return request.get({ url: `/developer/app/detail`, params: { appid: id } })
}

export const setEnable = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/developer/app/enable`, params: { appid: id } })
}

export const setDisable = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/developer/app/disable`, params: { appid: id } })
}

export const setNotice = (id: string, notice: string): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-notice`, data: { appid: id, notice } })
}
