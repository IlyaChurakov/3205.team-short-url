import { Card, Typography } from 'antd';

const CopyResult = ({ value }: { value: string }) => {
  return (
    <Card title="Ваша ссылка">
      <Typography.Link
        href={value}
        target="_blank"
        copyable={{ text: value }}
        style={{
          background: '#f5f5f5',
          padding: '12px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        }}
      >
        {value}
      </Typography.Link>
    </Card>
  );
};

export default CopyResult;
