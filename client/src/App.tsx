import { useState, type MouseEvent } from 'react';
import {
  apiUrl,
  createShortUrl,
  deleteShortUrl,
  getShortUrlAnalytics,
  getShortUrlInfo,
  type ShortUrlAnalyticsResponse,
  type ShortUrlInfoResponse,
} from './api';

function App() {
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [userAlias, setUserAlias] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date>();

  const [shortUrl, setShortUrl] = useState<string>('');

  const [alias, setAlias] = useState<string>('');
  const [shortUrlInfo, setShortUrlInfo] = useState<ShortUrlInfoResponse>();
  const [shortUrlAnalytics, setShortUrlAnalytics] = useState<ShortUrlAnalyticsResponse>();

  const createShortUrlHandler = async (e: MouseEvent) => {
    e.preventDefault();

    const data = await createShortUrl({ originalUrl, alias: userAlias, expiresAt });
    if (!data) return;

    setShortUrl(apiUrl + '/' + data.alias);
    setAlias(data.alias);
  };

  const deleteShortUrlHandler = async (e: MouseEvent) => {
    e.preventDefault();

    await deleteShortUrl(alias);

    setShortUrlInfo(undefined);
    setShortUrlAnalytics(undefined);
    setAlias('');

    alert('Ссылка удалена');
  };

  const getShortUrlInfoHandler = async (e: MouseEvent) => {
    e.preventDefault();

    const data = await getShortUrlInfo(alias);
    if (!data) return;

    setShortUrlInfo(data);
  };

  const getShortUrlAnalyticsHandler = async (e: MouseEvent) => {
    e.preventDefault();

    const data = await getShortUrlAnalytics(alias);
    if (!data) return;

    setShortUrlAnalytics(data);
  };

  return (
    <div>
      <form>
        <p>Создание ссылки:</p>

        <input
          placeholder="original url"
          value={originalUrl}
          onInput={(e) => setOriginalUrl(e.currentTarget.value)}
        />

        <input
          placeholder="alias"
          value={userAlias}
          onInput={(e) => setUserAlias(e.currentTarget.value)}
        />

        <input
          type="date"
          value={userAlias}
          onInput={(e) => setExpiresAt(new Date(e.currentTarget.value))}
        />

        <button onClick={createShortUrlHandler}>Создать короткий url</button>
      </form>

      <a href={shortUrl} target="_blank" style={{ color: 'red' }}>
        {shortUrl}
      </a>

      <form>
        <p>Взаимодействие с ссылкой:</p>

        <input
          placeholder="short url"
          value={alias}
          onInput={(e) => setAlias(e.currentTarget.value)}
        />

        <button onClick={deleteShortUrlHandler}>Удалить короткий url</button>
        <button onClick={getShortUrlInfoHandler}>Получить инфо о ссылке</button>
        <button onClick={getShortUrlAnalyticsHandler}>Получить аналитику ссылки</button>
      </form>

      {!!shortUrlInfo && (
        <ul>
          <li>Количество переходов: {shortUrlInfo?.clickCount}</li>
          <li>Дата создания: {dateFormatter.format(new Date(shortUrlInfo.createdAt))}</li>
          <li>
            Оригинальный url: <a href={shortUrlInfo?.originalUrl}>{shortUrlInfo?.originalUrl}</a>
          </li>
        </ul>
      )}

      {!!shortUrlAnalytics && (
        <ul>
          <li>Количество переходов: {shortUrlAnalytics.clickCount}</li>
          <li>Последние ip: {shortUrlAnalytics.lastIps?.map(({ ip }) => ip).join(', ')}</li>
        </ul>
      )}
    </div>
  );
}

const dateFormatter = new Intl.DateTimeFormat('ru', {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default App;
