import useSWR from 'swr';
import { GameDiscrepancy, PlayerDiscrepancy, TeamDiscrepancy } from 'types';

const BASE_API_URL = 'http://localhost:3000'; // TODO: move to config

const fetcher = (...args: unknown[]) => fetch(...args).then(res => res.json());

export const useDiscrepancies = <T extends TeamDiscrepancy | GameDiscrepancy | PlayerDiscrepancy>(
  // TODO: fix issue with DISCREPANCIES_TYPE enum import and replace magic strings
  type: string,
) => {
  const { data, error, isLoading } = useSWR<T[]>(
    `${BASE_API_URL}/discrepancies?type=${String(type)}`,
    fetcher,
  );

  return {
    discrepancies: data,
    isLoading,
    isError: error,
  };
};
