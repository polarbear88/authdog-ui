import request from '@/config/axios'

export const getProfile = (): Promise<IResponse<any>> => {
  return request.get({ url: '/saler/profile' })
}

export const setSubordinatePrice = (subordinatePrice: any): Promise<IResponse<any>> => {
  return request.post({
    url: '/saler/profile/set-subordinate-price',
    data: {
      subordinatePrice
    }
  })
}
