import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Radio, Space, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { TQuestionItem, useJudgeExam, useSubmitScore } from '@/services/exam';
import { ExamStatus, getUserByUsername } from '@/services/login';
import { flushSync } from 'react-dom';

const ExamPage: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const { data, refetch } = useJudgeExam(
    ['judgeExam'],
    {},
    {
      refetchOnWindowFocus: false,
      enabled: currentUser?.judgeExamination === ExamStatus.未通过考试,
    },
  );
  const [questionList, setQuestionList] = useState<TQuestionItem[]>([]);

  const { mutateAsync } = useSubmitScore({
    onSuccess(res) {},
  });

  useEffect(() => {
    setQuestionList(data || ([] as any));
  }, [data]);

  const confirmAnswer = async () => {
    const hasWithoutAnswer = questionList.find((qut) => !qut.answer);
    if (hasWithoutAnswer) {
      message.info('请完整提交答卷');
    }
    let score = 0;
    questionList.forEach((item) => {
      if (item.chooseAnswer === item.answer) {
        score += 10;
      }
    });
    await mutateAsync({
      score,
    });
    if (score >= 80) {
      message.success('考试通过');
      const user = (await getUserByUsername(currentUser?.username)) as any;
      localStorage.setItem('login-user', JSON.stringify(user));
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: user,
        }));
      });
    } else {
      message.info('考试未通过，请重新答题');
      refetch();
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
            欢迎使用
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

          {currentUser?.judgeExamination === ExamStatus.未通过考试 ? (
            <>
              {questionList?.map((qut, index) => (
                <div className=" mb-2" key={index}>
                  <p>{qut.questionText}</p>
                  <div>
                    <Radio.Group
                      value={qut.chooseAnswer}
                      onChange={(val) => {
                        console.log('val', val.target.value);
                        const value = val.target.value;
                        const newQuestion = [...questionList];
                        newQuestion[index].chooseAnswer = value;
                        console.log('new', newQuestion);
                        setQuestionList(newQuestion);
                      }}
                    >
                      <Space direction="vertical">
                        <Radio value={'A'}>{qut.optionA}</Radio>
                        <Radio value={'B'}>{qut.optionB}</Radio>
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
            </>
          ) : (
            <div>您已通过考试</div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default ExamPage;
