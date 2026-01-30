/** @type {import('next').NextConfig} */
function toHostname(url) {
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

const qrHosts = [
  toHostname(process.env.NEXT_PUBLIC_WECHAT_PAY_QR),
  toHostname(process.env.NEXT_PUBLIC_ALIPAY_QR),
].filter(Boolean)

const remotePatterns = []
for (const hostname of new Set(qrHosts)) {
  remotePatterns.push({ protocol: 'https', hostname })
  remotePatterns.push({ protocol: 'http', hostname })
}

const nextConfig = {
  images: remotePatterns.length ? { remotePatterns } : undefined,
}

export default nextConfig
