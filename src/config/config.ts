export const APP_ENV = process.env.APP_ENV || 'development'
export const IS_PRODUCTION = APP_ENV === 'production'
export const IS_TEST = APP_ENV === 'test'
export const APP_PORT = Number(process.env.APP_PORT) || 9010

export const REDIS_URL = `${process.env.REDIS_URL}`
export const REDIS_PORT = `${process.env.REDIS_PORT}`
export const REDIS_PASSWORD = `${process.env.REDIS_PASSWORD}`

export const APP_NAME = process.env.APP_NAME || 'ESport Tournament API'
export const APP_URL = process.env.APP_URL || 'http://localhost:9010'
