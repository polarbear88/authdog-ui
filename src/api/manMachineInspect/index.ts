import request from '@/config/axios'

export const getManMachineInspectConfig = (): Promise<IResponse<any>> => {
  return request.get({ url: '/man-machine-inspect/config' })
}
