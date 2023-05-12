export type ApplicationInfo = {
  id: number

  createdAt: Date

  updatedAt: Date

  developerId: number

  name: string

  version: string

  // 状态
  status: string

  // 是否强制升级
  forceUpgrade: boolean

  // 新版本下载地址
  downloadUrl: string

  // 通知
  nitice: string

  // 加密模式
  cryptoMode: string

  // 加密私钥 如果是aes模式，这里存的是aes密钥
  cryptoSecret: string

  // 加密公钥
  cryptoPublicKey: string

  // 试用时间 单位：分钟 0表示不允许试用
  trialTime: number

  // 授权模式
  authMode: string

  // 是否免费 免费后不需要授权 但是需要登录
  free: boolean

  // 是否绑定机器码 绑定后只能在绑定的机器上使用
  bindDevice: boolean

  // 是否允许解绑
  allowUnbind: boolean

  // 解绑一次扣时间 单位：分钟
  unbindDeductTime: number

  // 解绑一次扣次数
  unbindDeductCount: number

  // 最大解绑次数
  maxUnbindCount: number

  // 如果在用户模式下且不绑定机器码是否允许多设备登录
  allowMultiDevice: boolean

  // 如果允许多设备登录，最大同时登录设备数
  maxMultiDevice: number

  // 是否使用扣点模式
  useCountMode: boolean

  // 次数用尽是否允许登录
  allowLoginWhenCountUsedUp: boolean

  // 在允许多设备登录的情况下，是否允许强制登录 如果不允许，那么当设备数达到上限时，新设备登录会被拒绝 如果允许，那么新设备登录会踢掉旧设备
  allowForceLogin: boolean

  customCryptFunId: number
}
