import request from '@/config/axios'

export const getList = (word?: string, appid?: string): Promise<IResponse<any[]>> => {
  return request.get({ url: '/developer/cloudfun/list', params: { word, appid } })
}

export const createCloudfun = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/cloudfun/create', data })
}

export const updateCloudfun = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/developer/cloudfun/update', data })
}

export const deleteCloudfun = (id: number): Promise<IResponse<any>> => {
  return request.get({ url: '/developer/cloudfun/delete?id=' + id })
}

export const getScript = (id: number): Promise<IResponse<any>> => {
  return request.get({ url: '/developer/cloudfun/get-script?id=' + id })
}
