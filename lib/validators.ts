/**
 * 验证外部 URL（demoUrl）
 * 只允许 http/https 协议，拒绝危险协议
 */
export function validateDemoUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: true }; // 可选字段，空值合法
  }

  if (url.length > 2048) {
    return { valid: false, error: 'URL 长度不能超过 2048 字符' };
  }

  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: '只允许 http:// 或 https:// 协议' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'URL 格式无效' };
  }
}

/**
 * 验证截图 URL
 * 检查格式并防止 SSRF（私有 IP、localhost 等）
 */
export function validateScreenshotUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: '截图 URL 不能为空' };
  }

  if (url.length > 2048) {
    return { valid: false, error: 'URL 长度不能超过 2048 字符' };
  }

  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: '只允许 http:// 或 https:// 协议' };
    }

    // 防止 SSRF：拒绝私有 IP 和 localhost
    const hostname = parsed.hostname.toLowerCase();

    const dangerousHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'metadata.google.internal',
      '169.254.169.254', // AWS metadata
    ];

    if (dangerousHosts.includes(hostname)) {
      return { valid: false, error: '不允许使用内部地址' };
    }

    // 检查私有 IP 段
    const privateIpPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
    ];

    if (privateIpPatterns.some(pattern => pattern.test(hostname))) {
      return { valid: false, error: '不允许使用私有 IP 地址' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'URL 格式无效' };
  }
}

/**
 * 批量验证截图 URL 数组
 */
export function validateScreenshots(urls: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (urls.length > 10) {
    errors.push('截图数量不能超过 10 张');
  }

  urls.forEach((url, index) => {
    const result = validateScreenshotUrl(url);
    if (!result.valid) {
      errors.push(`截图 ${index + 1}: ${result.error}`);
    }
  });

  return { valid: errors.length === 0, errors };
}
