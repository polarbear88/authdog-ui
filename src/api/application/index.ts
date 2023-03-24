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

export const setEnableForceUpgrade = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/developer/app/enable-forceUpgrade`, params: { appid: id } })
}

export const setDisableForceUpgrade = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/developer/app/disable-forceUpgrade`, params: { appid: id } })
}

export const setDownloadUrl = (id: string, downloadUrl: string): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-downloadUrl`, data: { appid: id, downloadUrl } })
}

export const setVersion = (id: string, version: string): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-version`, data: { appid: id, version } })
}

export const resetCryptoMode = (id: string, cryptoMode: string): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/reset-cryptoMode`, data: { appid: id, cryptoMode } })
}

export const setIsFree = (id: string, isFree: boolean): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-free`, data: { appid: id, free: isFree } })
}

export const setTrialTime = (id: string, trialTime: number): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-trialTime`, data: { appid: id, trialTime } })
}

export const setBindDevice = (id: string, bindDevice: boolean): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-bindDevice`, data: { appid: id, bindDevice } })
}

export const setAllowUnbind = (id: string, allowUnbind: boolean): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-allowUnbind`, data: { appid: id, allowUnbind } })
}

export const setUnbindDeductTime = (
  id: string,
  unbindDeductTime: number
): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-unbindDeductTime`,
    data: { appid: id, unbindDeductTime }
  })
}

export const setUnbindDeductCount = (
  id: string,
  unbindDeductCount: number
): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-unbindDeductCount`,
    data: { appid: id, unbindDeductCount }
  })
}

export const setMaxUnbindCount = (id: string, maxUnbindCount: number): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-maxUnbindCount`,
    data: { appid: id, maxUnbindCount }
  })
}

export const setAllowMultiDevice = (id: string, allowUnbind: boolean): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-allowMultiDevice`,
    data: { appid: id, allowUnbind }
  })
}

export const setMaxMultiDevice = (id: string, maxUnbindCount: number): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-maxMultiDevice`,
    data: { appid: id, maxUnbindCount }
  })
}

export const setUseCountMode = (id: string, useCountMode: boolean): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-useCountMode`,
    data: { appid: id, useCountMode }
  })
}

export const setAllowLoginWhenCountUsedUp = (
  id: string,
  allowLoginWhenCountUsedUp: boolean
): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-allowLoginWhenCountUsedUp`,
    data: { appid: id, allowLoginWhenCountUsedUp }
  })
}

export const createApplication = (data: any): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/create`,
    data
  })
}

export const setTrialCount = (id: string, trialCount: number): Promise<IResponse<any>> => {
  return request.post({ url: `/developer/app/set-trialCount`, data: { appid: id, trialCount } })
}

export const setAllowForceLogin = (
  id: string,
  allowForceLogin: boolean
): Promise<IResponse<any>> => {
  return request.post({
    url: `/developer/app/set-allowForceLogin`,
    data: { appid: id, allowForceLogin }
  })
}
