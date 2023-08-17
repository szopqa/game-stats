import { expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { TeamDiscrepancy } from 'types';
import { useCallback } from 'react';
import { PlayerDiscrepancy } from 'types';
import { act } from 'react-dom/test-utils';
import { useDiscrepanciesIgnore } from './use-discrepancies-ignore.hook';
import { toAllDiscrepancies } from '../mappers/discrepancies-data-grid.mapper';

const mockDiscrepancies: (TeamDiscrepancy | PlayerDiscrepancy)[] = [
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

test('should remove ignored elements from the list', () => {
  // given
  const { result } = renderHook(() =>
    useDiscrepanciesIgnore(
      mockDiscrepancies,
      useCallback(discrepancies => toAllDiscrepancies(discrepancies), []),
    ),
  );

  const IDS_TO_IGNORE = [
    result.current.discrepanciesToShow[0].id,
    result.current.discrepanciesToShow[1].id,
  ];

  expect(result.current.discrepanciesToShow.length).toBe(8);

  // when
  act(() => {
    result.current.setIgnoreSelectedIds(IDS_TO_IGNORE);
  });

  act(() => {
    result.current.handleIgnore();
  });

  // then
  expect(result.current.discrepanciesToShow.length).toBe(6);
  expect(result.current.discrepanciesToShow.every(elem => !IDS_TO_IGNORE.includes(elem.id))).toBe(
    true,
  );
});
