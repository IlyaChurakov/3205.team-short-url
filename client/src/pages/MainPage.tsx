import { useState, type MouseEvent } from 'react';
import {
  createShortUrl,
  deleteShortUrl,
  getShortUrlAnalytics,
  getShortUrlInfo,
  type ShortUrlAnalyticsResponse,
  type ShortUrlInfoResponse,
} from '../shared/api';
import { apiUrl } from '../shared/config';
import styles from './mainPage.module.css';
import { Button, DatePicker, Divider, Flex, Form, Input, List, Typography } from 'antd';
import CopyResult from '../components/CopyResult';
import { dateFormatter } from '../shared/utils';

const MainPage = () => {
  const [createdShortUrl, setCreatedShortUrl] = useState<string>('');

  const [shortUrl, setShortUrl] = useState<string>('');
  const [shortUrlInfo, setShortUrlInfo] = useState<ShortUrlInfoResponse>();
  const [shortUrlAnalytics, setShortUrlAnalytics] = useState<ShortUrlAnalyticsResponse>();

  const createShortUrlHandler = async (values: Record<string, unknown>) => {
    const data = await createShortUrl(values);
    if (!data) return;

    setCreatedShortUrl(apiUrl + '/' + data.alias);
    setShortUrl(apiUrl + '/' + data.alias);
  };

  const deleteShortUrlHandler = async (e: MouseEvent) => {
    e.preventDefault();

    await deleteShortUrl(shortUrl);

    setShortUrlInfo(undefined);
    setShortUrlAnalytics(undefined);
    setShortUrl('');
  };

  const getShortUrlInfoHandler = async (e: MouseEvent) => {
    e.preventDefault();

    const data = await getShortUrlInfo(shortUrl);
    if (!data) return;

    setShortUrlInfo(data);
  };

  const getShortUrlAnalyticsHandler = async (e: MouseEvent) => {
    e.preventDefault();

    const data = await getShortUrlAnalytics(shortUrl);
    if (!data) return;

    setShortUrlAnalytics(data);
  };

  return (
    <div className={styles.page}>
      <Form colon={false} onFinish={createShortUrlHandler} initialValues={{ originalUrl: '' }}>
        <Typography.Title level={3}>Создание короткой ссылки</Typography.Title>

        <Form.Item
          name="originalUrl"
          rules={[{ required: true, message: 'Введите оригинальный URL' }]}
        >
          <Input placeholder="Введите адрес" />
        </Form.Item>

        <Form.Item name="alias">
          <Input placeholder="Алиас" />
        </Form.Item>

        <Form.Item name="expiresAt">
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Дата окончания действия"
            allowClear={false}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Создать
          </Button>
        </Form.Item>
      </Form>

      {createdShortUrl && <CopyResult value={createdShortUrl} />}

      <Divider />

      <Typography.Title level={3}>Работа с короткой ссылкой</Typography.Title>

      <Flex vertical gap={20}>
        <Input
          placeholder="Вставьте короткую ссылку"
          value={shortUrl}
          onChange={(e) => setShortUrl(e.currentTarget.value)}
        />

        <Flex gap={20}>
          <Button type="primary" onClick={getShortUrlInfoHandler}>
            Получить информацию
          </Button>

          <Button type="primary" onClick={getShortUrlAnalyticsHandler}>
            Получить аналитику
          </Button>

          <Button type="primary" danger onClick={deleteShortUrlHandler}>
            Удалить короткий url
          </Button>
        </Flex>

        {!!shortUrlInfo && (
          <List
            header={<div>Информация</div>}
            bordered
            dataSource={[
              { label: 'Количество переходов', value: shortUrlInfo.clickCount },
              {
                label: 'Дата создания',
                value: dateFormatter.format(new Date(shortUrlInfo.createdAt)),
              },
              { label: 'Оригинальный URL', value: shortUrlInfo.originalUrl },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Flex justify="space-between" style={{ width: '100%' }}>
                  <Typography.Text strong>{item.label}:</Typography.Text>
                  <Typography.Text>{item.value}</Typography.Text>
                </Flex>
              </List.Item>
            )}
          />
        )}

        {!!shortUrlAnalytics && (
          <List
            header={<div>Аналитика</div>}
            bordered
            dataSource={[
              { label: 'Количество переходов', value: shortUrlAnalytics.clickCount },
              {
                label: 'Последние ip',
                value: shortUrlAnalytics.lastIps.map(({ ip }) => ip).join(', '),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Flex justify="space-between" style={{ width: '100%' }}>
                  <Typography.Text strong>{item.label}:</Typography.Text>
                  <Typography.Text>{item.value}</Typography.Text>
                </Flex>
              </List.Item>
            )}
          />
        )}
      </Flex>
    </div>
  );
};

export default MainPage;
