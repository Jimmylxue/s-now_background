import { ClientError } from '@/core/request/core';
import { QueryKey, UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import { get, post } from '../request';
import { TPageData } from '../type';

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

/**
 * 管理员获取题目列表
 */
export function useExamQuestionList(
  queryKey: QueryKey,
  variable?: any,
  config?: UseQueryOptions<TPageData<TQuestionItem[]>, ClientError>,
) {
  return useQuery<TPageData<TQuestionItem[]>, ClientError>(
    queryKey,
    () => {
      return get('/question/questionPage', variable);
    },
    config,
  );
}

export function useDelQuestionItem(
  options?: UseMutationOptions<boolean, ClientError, { id: number }>,
) {
  return useMutation<boolean, ClientError, { id: number }>(
    (data) => get(`/question/delete`, data),
    options,
  );
}

export function useAddQuestionItem(
  options?: UseMutationOptions<boolean, ClientError, TQuestionItem>,
) {
  return useMutation<boolean, ClientError, TQuestionItem>(
    (data) => get(`/question/add`, data),
    options,
  );
}
