import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Radio, Space, message, theme } from 'antd';
import React, { useState } from 'react';
import { Link } from '@umijs/max';

const ExamPage: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [questionList, setQuestionList] = useState([
    {
      title: '当有顾客比较暴躁时我们应该怎么办？',
      A: 'A：应该让他再继续生气',
      B: 'B：理性的告诉他应该怎么',
      answer: '',
    },
    {
      title: '当有顾客提出想要全额退款时，应该怎么办？',
      A: 'A：合理观察结果',
      B: 'B：不知道不知道',
      answer: '',
    },
  ]);

  const confirmAnswer = () => {
    const hasWithoutAnswer = questionList.find((qut) => !qut.answer);
    if (hasWithoutAnswer) {
      message.info('请完整提交答卷');
    }
  };
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
            欢迎使用 进入考试
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
            考试通过后，方可成为一名正式法官，加入评审员，对案件做出自己的判决
          </p>

          {questionList.map((qut, index) => (
            <div className=" mb-2" key={index}>
              <p>{qut.title}</p>
              <div>
                <Radio.Group
                  value={qut.answer}
                  onChange={(val) => {
                    console.log('val', val.target.value);
                    const value = val.target.value;
                    const newQuestion = [...questionList];
                    newQuestion[index].answer = value;
                    setQuestionList(newQuestion);
                  }}
                >
                  <Space direction="vertical">
                    <Radio value={'A'}>{qut.A}</Radio>
                    <Radio value={'B'}>{qut.B}</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          ))}

          <div className=" mt-4 flex justify-center">
            <Button type="primary" onClick={confirmAnswer}>
              提交答案
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ExamPage;
