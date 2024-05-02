import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  Outlet,
  useAppData,
  matchRoutes,
  type IRoute,
} from '@umijs/max';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
  showMore?: boolean;
  path: string;
}> = ({ title, href, index, desc, showMore = false, path }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <Link to={path}>
        <div
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              lineHeight: '22px',
              backgroundSize: '100%',
              textAlign: 'center',
              padding: '8px 16px 16px 12px',
              color: '#FFF',
              fontWeight: 'bold',
              backgroundImage:
                "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
            }}
          >
            {index}
          </div>
          <div
            style={{
              fontSize: '16px',
              color: token.colorText,
              paddingBottom: 8,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontSize: '14px',
            color: token.colorTextSecondary,
            textAlign: 'justify',
            lineHeight: '22px',
            marginBottom: 8,
          }}
        >
          {desc}
        </div>
        {showMore && (
          <a href={href} target="_blank" rel="noreferrer">
            了解更多 {'>'}
          </a>
        )}
      </Link>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用 小法庭系统
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            小法庭系统，专注于解决买家与卖家之间的矛盾纠葛。下面请选择您的身份。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              path="/welcome"
              index={1}
              href="https://umijs.org/docs/introduce/introduce"
              title="我是法官"
              desc="参加法官小测验，后续可以参与一些案件的审理和做出关键性的投票。"
            />
            <InfoCard
              path="/welcome"
              index={2}
              title="我是买家/卖家"
              href="https://ant.design"
              desc="发起一些案件的诉讼申请。由陪审团成员法官为您主持公道"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
