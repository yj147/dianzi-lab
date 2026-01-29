import {
  getCachedSunTimes,
  isDarkTimeSync,
  requestLocationAndCacheSunTimes,
} from '@/lib/sun-times'

jest.mock('suncalc', () => ({
  getTimes: jest.fn(() => ({
    sunrise: new Date('2026-01-29T07:00:00.000Z'),
    sunset: new Date('2026-01-29T17:00:00.000Z'),
  })),
}))

const SUN_TIMES_CACHE_KEY = 'sun_times'
const SUN_TIMES_GEO_BLOCKED_UNTIL_KEY = 'sun_times_geo_blocked_until'
const CACHE_DURATION = 24 * 60 * 60 * 1000

function setCachedSunTimes(
  data: Partial<{
    sunriseMs: number
    sunsetMs: number
    date: string
    timestamp: number
  }>
) {
  const today = new Date().toLocaleDateString('en-CA')
  const value = {
    sunriseMs: Date.now() - 60 * 60 * 1000,
    sunsetMs: Date.now() + 60 * 60 * 1000,
    date: today,
    timestamp: Date.now(),
    ...data,
  }

  localStorage.setItem(SUN_TIMES_CACHE_KEY, JSON.stringify(value))
  return value
}

describe('lib/sun-times', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()

    Object.defineProperty(window.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: jest.fn(),
      },
    })
  })

  describe('getCachedSunTimes', () => {
    it('没有缓存时返回 null', () => {
      expect(getCachedSunTimes()).toBeNull()
    })

    it('缓存过期时清理并返回 null', () => {
      setCachedSunTimes({ timestamp: Date.now() - CACHE_DURATION - 1 })

      expect(getCachedSunTimes()).toBeNull()
      expect(localStorage.getItem(SUN_TIMES_CACHE_KEY)).toBeNull()
    })

    it('缓存日期非今天时清理并返回 null', () => {
      setCachedSunTimes({ date: '1999-01-01' })

      expect(getCachedSunTimes()).toBeNull()
      expect(localStorage.getItem(SUN_TIMES_CACHE_KEY)).toBeNull()
    })

    it('缓存合法时返回数据', () => {
      const expected = setCachedSunTimes({})
      expect(getCachedSunTimes()).toEqual(expected)
    })
  })

  describe('isDarkTimeSync', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('没有缓存时按固定 6/18 点降级', () => {
      jest.setSystemTime(new Date(2026, 0, 29, 2, 0, 0))
      expect(isDarkTimeSync()).toBe(true)

      jest.setSystemTime(new Date(2026, 0, 29, 12, 0, 0))
      expect(isDarkTimeSync()).toBe(false)

      jest.setSystemTime(new Date(2026, 0, 29, 20, 0, 0))
      expect(isDarkTimeSync()).toBe(true)
    })
  })

  describe('requestLocationAndCacheSunTimes', () => {
    it('已有缓存时直接返回 true，不触发定位', async () => {
      setCachedSunTimes({})

      const geolocation = window.navigator.geolocation as unknown as {
        getCurrentPosition: jest.Mock
      }

      await expect(requestLocationAndCacheSunTimes()).resolves.toBe(true)
      expect(geolocation.getCurrentPosition).not.toHaveBeenCalled()
    })

    it('定位成功时写入缓存并返回 true（含更宽松的 timeout 配置）', async () => {
      const geolocation = window.navigator.geolocation as unknown as {
        getCurrentPosition: jest.Mock
      }

      geolocation.getCurrentPosition.mockImplementation(
        (success: (pos: GeolocationPosition) => void) => {
          success({
            coords: {
              latitude: 31.2304,
              longitude: 121.4737,
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition)
        }
      )

      await expect(requestLocationAndCacheSunTimes()).resolves.toBe(true)
      expect(localStorage.getItem(SUN_TIMES_CACHE_KEY)).not.toBeNull()

      const options = geolocation.getCurrentPosition.mock.calls[0]?.[2]
      expect(options).toEqual(
        expect.objectContaining({
          timeout: 30 * 1000,
          maximumAge: CACHE_DURATION,
          enableHighAccuracy: false,
        })
      )
    })

    it('用户拒绝定位时写入 geo blocked 并返回 false', async () => {
      const geolocation = window.navigator.geolocation as unknown as {
        getCurrentPosition: jest.Mock
      }

      geolocation.getCurrentPosition.mockImplementation(
        (_success: unknown, error: (e: GeolocationPositionError) => void) => {
          error({ code: 1, message: 'denied', PERMISSION_DENIED: 1 } as any)
        }
      )

      await expect(requestLocationAndCacheSunTimes()).resolves.toBe(false)
      expect(localStorage.getItem(SUN_TIMES_GEO_BLOCKED_UNTIL_KEY)).not.toBeNull()
    })

    it('TIMEOUT 不应写入 geo blocked', async () => {
      const geolocation = window.navigator.geolocation as unknown as {
        getCurrentPosition: jest.Mock
      }

      geolocation.getCurrentPosition.mockImplementation(
        (_success: unknown, error: (e: GeolocationPositionError) => void) => {
          error({ code: 3, message: 'timeout', TIMEOUT: 3 } as any)
        }
      )

      await expect(requestLocationAndCacheSunTimes()).resolves.toBe(false)
      expect(localStorage.getItem(SUN_TIMES_GEO_BLOCKED_UNTIL_KEY)).toBeNull()
    })
  })
})
