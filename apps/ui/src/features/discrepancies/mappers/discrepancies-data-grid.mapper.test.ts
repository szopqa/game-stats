import { expect } from 'vitest';
import { TeamDiscrepancy } from 'types';
import { PlayerDiscrepancy } from 'types';
import { toBaseRows, toPlayerRows, toTeamRows } from './discrepancies-data-grid.mapper';

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

test('should map team discrepancies to separate rows applicable to data grid', () => {
  // given
  const discrepancies = mockTeamDiscrepancies;

  // when
  const rows = toTeamRows(discrepancies);

  // then
  expect(rows.length).toBe(4);
  expect(
    rows.every(
      row =>
        row.statName !== undefined &&
        row.statType === 'TEAM' &&
        row.teamId !== undefined &&
        row.playerId === undefined &&
        row.value !== undefined &&
        row.id !== undefined,
    ),
  ).toBe(true);
});

test('should map game discrepancy to separate rows applicable to data grid', () => {
  // given
  const discrepancies = mockedGameDiscrepancies;

  // when
  const rows = toBaseRows(discrepancies);

  // then
  expect(rows.length).toBe(2);
  expect(
    rows.every(
      row =>
        row.statName !== undefined &&
        row.statType === 'GAME' &&
        row.teamId === undefined &&
        row.playerId === undefined &&
        row.value !== undefined &&
        row.id !== undefined,
    ),
  ).toBe(true);
});

test('should map player discrepancies to separate rows applicable to data grid', () => {
  // given
  const discrepancies = mockPlayerDiscrepancies;

  // when
  const rows = toPlayerRows(discrepancies);

  // then
  expect(rows.length).toBe(4);
  expect(
    rows.every(
      row =>
        row.statName !== undefined &&
        row.statType === 'PLAYER' &&
        row.teamId !== undefined &&
        row.playerId !== undefined &&
        row.value !== undefined &&
        row.id !== undefined,
    ),
  ).toBe(true);
});
