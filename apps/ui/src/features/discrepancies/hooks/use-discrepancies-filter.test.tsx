import { useDiscrepanciesFilter } from './use-discrepancies-filter.hook';
import { expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { TeamDiscrepancy } from 'types';
import { useCallback } from 'react';
import { GameDiscrepancy } from 'types';
import { PlayerDiscrepancy } from 'types';
import { act } from 'react-dom/test-utils';
import { SelectChangeEvent } from '@mui/material';

const mockTeamDiscrepancies: TeamDiscrepancy[] = [
  {
    meta: {
      statType: 'TEAM',
      id: '15adf794-5630-4dc4-b0e7-f8d437b585b1__TEAM__ba27615c-07df-41f0-864b-332575f744f2__rushYards',
      teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
    },
    statName: 'rushYards',
    values: [
      {
        sourceId: 'sr',
        value: 97,
      },
      {
        sourceId: 'external',
        value: 105,
      },
    ],
  },
  {
    meta: {
      statType: 'TEAM',
      id: '15adf794-5630-4dc4-b0e7-f8d437b585b1__TEAM__344e408b-846e-44ac-b491-7802ab0f7af0__rushYards',
      teamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
    },
    statName: 'rushYards',
    values: [
      {
        sourceId: 'sr',
        value: 78,
      },
      {
        sourceId: 'external',
        value: 90,
      },
    ],
  },
];

const mockedGameDiscrepancies = [
  {
    meta: {
      statType: 'GAME',
      id: '15adf794-5630-4dc4-b0e7-f8d437b585b1__GAME__attendance',
      awayTeamId: 'ba27615c-07df-41f0-864b-332575f744f2',
      homeTeamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
    },
    statName: 'attendance',
    values: [
      {
        sourceId: 'sr',
        value: 62487,
      },
      {
        sourceId: 'external',
        value: 33876,
      },
    ],
  },
];

const mockPlayerDiscrepancies: PlayerDiscrepancy[] = [
  {
    meta: {
      statType: 'PLAYER',
      id: '15adf794-5630-4dc4-b0e7-f8d437b585b1__PLAYER__e11a2815-8f31-44b0-8c37-64240bcbc059__ba27615c-07df-41f0-864b-332575f744f2__rushTouchdowns',
      teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
      playerId: 'e11a2815-8f31-44b0-8c37-64240bcbc059',
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
    },
    statName: 'rushTouchdowns',
    values: [
      {
        sourceId: 'sr',
        value: 1,
      },
      {
        sourceId: 'external',
        value: 2,
      },
    ],
  },
  {
    meta: {
      statType: 'PLAYER',
      id: '15adf794-5630-4dc4-b0e7-f8d437b585b1__PLAYER__713daff7-86cc-4283-91a8-1579c3f58f59__ba27615c-07df-41f0-864b-332575f744f2__rushYards',
      teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
      playerId: '713daff7-86cc-4283-91a8-1579c3f58f59',
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
    },
    statName: 'rushYards',
    values: [
      {
        sourceId: 'sr',
        value: 76,
      },
      {
        sourceId: 'external',
        value: 73,
      },
    ],
  },
];

test('should initialize with default values set to team ids when using to filter team discrepancies', () => {
  const { result } = renderHook(() =>
    useDiscrepanciesFilter<TeamDiscrepancy>(
      mockTeamDiscrepancies,
      useCallback(discrepancy => discrepancy.meta.teamId, []),
    ),
  );

  expect(result.current.filterId).toBe('All');
  expect(result.current.filterIds).toEqual([
    'All',
    'ba27615c-07df-41f0-864b-332575f744f2',
    '344e408b-846e-44ac-b491-7802ab0f7af0',
  ]);
  expect(result.current.discrepanciesToShow).toEqual(mockTeamDiscrepancies);
});

test('should initialize with default values set to game ids when using to player game discrepancies', () => {
  const { result } = renderHook(() =>
    useDiscrepanciesFilter<GameDiscrepancy>(
      mockedGameDiscrepancies,
      useCallback(discrepancy => discrepancy.meta.gameId, []),
    ),
  );

  expect(result.current.filterId).toBe('All');
  expect(result.current.filterIds).toEqual(['All', '15adf794-5630-4dc4-b0e7-f8d437b585b1']);
  expect(result.current.discrepanciesToShow).toEqual(mockedGameDiscrepancies);
});

test('should initialize with default values set to player ids when using to filter player discrepancies', () => {
  const { result } = renderHook(() =>
    useDiscrepanciesFilter<PlayerDiscrepancy>(
      mockPlayerDiscrepancies,
      useCallback(discrepancy => discrepancy.meta.playerId, []),
    ),
  );

  expect(result.current.filterId).toBe('All');
  expect(result.current.filterIds).toEqual([
    'All',
    'e11a2815-8f31-44b0-8c37-64240bcbc059',
    '713daff7-86cc-4283-91a8-1579c3f58f59',
  ]);
  expect(result.current.discrepanciesToShow).toEqual(mockPlayerDiscrepancies);
});

test('should handle filtering by updating filterId and discrepanciesToShow on filter change', () => {
  // given
  const NEW_FILTER = 'ba27615c-07df-41f0-864b-332575f744f2';
  const { result } = renderHook(() =>
    useDiscrepanciesFilter<TeamDiscrepancy>(
      mockTeamDiscrepancies,
      useCallback(discrepancy => discrepancy.meta.teamId, []),
    ),
  );

  expect(result.current.filterId).toBe('All');
  expect(result.current.discrepanciesToShow).toEqual([...mockTeamDiscrepancies]);
  expect(result.current.filterIds).toEqual([
    'All',
    NEW_FILTER,
    '344e408b-846e-44ac-b491-7802ab0f7af0',
  ]);

  // when
  act(() => {
    result.current.handleIdFilterChanged({
      target: { value: NEW_FILTER },
    } as SelectChangeEvent);
  });

  // Check updated values
  expect(result.current.filterId).toBe(NEW_FILTER);
  expect(result.current.discrepanciesToShow).toEqual([mockTeamDiscrepancies[0]]);
});
