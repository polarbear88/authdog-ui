import request from '@/config/axios'

export const verifyEntryToken = (token: string): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/auth/verify-entry-token?token=' + token })
}

export const registerApi = (data: any): Promise<IResponse<null>> => {
  return request.post({ url: '/saler/auth/register', data })
}

export const loginApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/saler/auth/login', data })
}
