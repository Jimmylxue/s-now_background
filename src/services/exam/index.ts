import { ClientError } from '@/core/request/core';
import { QueryKey, UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import { post } from '../request';

type TUploadCase = {};

export function useUploadExamCase(options?: UseMutationOptions<boolean, ClientError, TUploadCase>) {
  return useMutation<boolean, ClientError, TUploadCase>(
    (data) => post('/user/register', data),
    options,
  );
}

export type TQuestionItem = {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  type: '选择' | '判断';
  answer: string;
  chooseAnswer?: string;
};

export function useJudgeExam(
  queryKey: QueryKey,
  variable?: any,
  config?: UseQueryOptions<TQuestionItem[], ClientError>,
) {
  return useQuery<TQuestionItem[], ClientError>(
    queryKey,
    () => {
      return post('/question/questionList', variable);
    },
    config,
  );
}

type TSubmitScore = {
  score: number;
};

export function useSubmitScore(options?: UseMutationOptions<boolean, ClientError, TSubmitScore>) {
  return useMutation<boolean, ClientError, TSubmitScore>(
    (data) => post(`/question/submit?score=${data.score}`, data),
    options,
  );
}
