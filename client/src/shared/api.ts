import { apiUrl } from './config';

const baseHeaders = { 'Content-Type': 'application/json' };

export interface CreatedShortUrlResponse {
  originalUrl: string;
  alias: string;
  expiresAt: Date | null;
  id: number;
  createdAt: Date;
}

export interface ShortUrlInfoResponse {
  createdAt: Date;
  clickCount: number;
  originalUrl: string;
}

export interface ShortUrlAnalyticsResponse {
  clickCount: number;
  lastIps: { ip: string }[];
}

export async function createShortUrl(body: Record<string, unknown>) {
  try {
    const response = await fetch(`${apiUrl}/shorten`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { ...baseHeaders },
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return data as unknown as CreatedShortUrlResponse;
  } catch (e) {
    const err = e as Error;
    alert(err.message || 'Не удалось создать ссылку');
  }
}

export async function getShortUrlInfo(shortUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/info/${encodeURIComponent(shortUrl)}`, {
      method: 'GET',
      headers: { ...baseHeaders },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return data as unknown as ShortUrlInfoResponse;
  } catch (e) {
    const err = e as Error;
    alert(err.message || 'Не удалось получить информацию');
  }
}

export async function getShortUrlAnalytics(shortUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/analytics/${encodeURIComponent(shortUrl)}`, {
      method: 'GET',
      headers: { ...baseHeaders },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return data as unknown as ShortUrlAnalyticsResponse;
  } catch (e) {
    const err = e as Error;
    alert(err.message || 'Не удалось получить аналитику');
  }
}

export async function deleteShortUrl(shortUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/delete/${encodeURIComponent(shortUrl)}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    alert('Ссылка удалена');
  } catch (e) {
    const err = e as Error;
    alert(err.message || 'Не удалось удалить короткую ссылку');
  }
}
