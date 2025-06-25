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

    return data as unknown as CreatedShortUrlResponse;
  } catch (e) {
    console.log(e);
    alert('Не удалось создать short url');
  }
}

export async function getShortUrlInfo(shortUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/info/${shortUrl}`, {
      method: 'GET',
      headers: { ...baseHeaders },
    });

    const data = await response.json();

    return data as unknown as ShortUrlInfoResponse;
  } catch (e) {
    console.log(e);
    alert('Не удалось получить информацию о short url');
  }
}

export async function getShortUrlAnalytics(shortUrl: string) {
  try {
    const response = await fetch(`${apiUrl}/analytics/${shortUrl}`, {
      method: 'GET',
      headers: { ...baseHeaders },
    });

    const data = await response.json();

    return data as unknown as ShortUrlAnalyticsResponse;
  } catch (e) {
    console.log(e);
    alert('Не удалось получить аналитику');
  }
}

export async function deleteShortUrl(shortUrl: string) {
  try {
    await fetch(`${apiUrl}/delete/${shortUrl}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.log(e);
    alert('Не удалось удалить short url');
  }
}
