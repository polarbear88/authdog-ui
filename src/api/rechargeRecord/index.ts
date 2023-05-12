import request from '@/config/axios'

export const getRechargeRecordList = (where?: any): Promise<IResponse<any>> => {
  if (!where) where = {}
  return request.post({ url: '/developer/recharge-record/getList', data: where })
}
