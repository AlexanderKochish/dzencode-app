export function getCorsOrigins(): string | string[] | RegExp {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  }

  const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  return baseUrl.split(',').map((u) => u.trim());
}
