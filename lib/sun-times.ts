const SUN_TIMES_CACHE_KEY = 'sun_times'
const SUN_TIMES_GEO_BLOCKED_UNTIL_KEY = 'sun_times_geo_blocked_until'
const CACHE_DURATION = 24 * 60 * 60 * 1000
const GEOLOCATION_TIMEOUT_MS = 30 * 1000

export interface CachedSunTimes {
  sunriseMs: number
  sunsetMs: number
  date: string
  timestamp: number
}

export function getCachedSunTimes(): CachedSunTimes | null {
  try {
    const cached = localStorage.getItem(SUN_TIMES_CACHE_KEY)
    if (!cached) return null

    const data: CachedSunTimes = JSON.parse(cached)
    const now = Date.now()
    const today = new Date().toLocaleDateString('en-CA')

    if (
      typeof data.sunriseMs !== 'number' ||
      typeof data.sunsetMs !== 'number' ||
      typeof data.timestamp !== 'number' ||
      typeof data.date !== 'string' ||
      isNaN(data.sunriseMs) ||
      isNaN(data.sunsetMs) ||
      !Number.isFinite(data.timestamp) ||
      now - data.timestamp > CACHE_DURATION ||
      data.date !== today
    ) {
      localStorage.removeItem(SUN_TIMES_CACHE_KEY)
      return null
    }

    return data
  } catch {
    return null
  }
}

function getGeoBlockedUntilMs(): number | null {
  try {
    const raw = localStorage.getItem(SUN_TIMES_GEO_BLOCKED_UNTIL_KEY)
    if (!raw) return null

    const untilMs = Number(raw)
    if (!Number.isFinite(untilMs)) {
      localStorage.removeItem(SUN_TIMES_GEO_BLOCKED_UNTIL_KEY)
      return null
    }

    if (untilMs <= Date.now()) {
      localStorage.removeItem(SUN_TIMES_GEO_BLOCKED_UNTIL_KEY)
      return null
    }

    return untilMs
  } catch {
    return null
  }
}

function setGeoBlockedUntilMs(untilMs: number): void {
  try {
    localStorage.setItem(SUN_TIMES_GEO_BLOCKED_UNTIL_KEY, String(untilMs))
  } catch {
    // ignore
  }
}

function cacheSunTimes(sunrise: Date, sunset: Date): void {
  try {
    const data: CachedSunTimes = {
      sunriseMs: sunrise.getTime(),
      sunsetMs: sunset.getTime(),
      date: new Date().toLocaleDateString('en-CA'),
      timestamp: Date.now(),
    }
    localStorage.setItem(SUN_TIMES_CACHE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function isDarkTimeSync(): boolean {
  const cached = getCachedSunTimes()

  if (!cached) {
    const hour = new Date().getHours()
    return hour < 6 || hour >= 18
  }

  const now = Date.now()
  return now < cached.sunriseMs || now >= cached.sunsetMs
}

export async function requestLocationAndCacheSunTimes(): Promise<boolean> {
  const cached = getCachedSunTimes()
  if (cached) return true

  const geoBlockedUntilMs = getGeoBlockedUntilMs()
  if (geoBlockedUntilMs) return false

  if (typeof navigator === 'undefined') return false
  if (!navigator.geolocation) return false

  const sunCalcImport = import('suncalc')

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          const now = new Date()

          const SunCalcModule = await sunCalcImport
          const SunCalc =
            'default' in SunCalcModule && SunCalcModule.default
              ? (SunCalcModule.default as unknown as typeof import('suncalc'))
              : SunCalcModule

          const times = SunCalc.getTimes(now, lat, lon)

          if (isNaN(times.sunrise.getTime()) || isNaN(times.sunset.getTime())) {
            resolve(false)
            return
          }

          cacheSunTimes(times.sunrise, times.sunset)
          resolve(true)
        } catch {
          resolve(false)
        }
      },
      (error) => {
        if (error.code === 1) {
          setGeoBlockedUntilMs(Date.now() + CACHE_DURATION)
        }
        resolve(false)
      },
      {
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: CACHE_DURATION,
        enableHighAccuracy: false,
      }
    )
  })
}
