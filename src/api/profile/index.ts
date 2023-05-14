import request from '@/config/axios'

export const changePassword = (
  oldPassword: string,
  newPassword: string
): Promise<IResponse<any>> => {
  return request.post({
    url: '/developer/profile/change-password',
    data: {
      oldPassword,
      newPassword
    }
  })
}

export const signJwtToken = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/profile/sign-jwt-token'
  })
}

export const getProfile = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/profile'
  })
}

export const recharge = (card: string): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/profile/recharge?card=' + card
  })
}

export const validateUserToken = (appid: number, token: string) => {
  return request.post({
    url: '/developer/profile/validate_user_token',
    data: {
      appid,
      token
    }
  })
}

export const getAuthdogVersion = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/profile/get-authdog-version'
  })
}

export const getIsOpenSourceUser = (): Promise<IResponse<any>> => {
  return request.get({
    url: '/developer/profile/is-open-source-user'
  })
}
