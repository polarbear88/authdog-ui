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
