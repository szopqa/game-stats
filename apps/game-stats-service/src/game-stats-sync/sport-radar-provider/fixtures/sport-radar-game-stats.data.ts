import { SportRadarGameStats } from 'types';

export const sportRadarGameStats: SportRadarGameStats = {
  sourceId: 'sr',
  game: {
    id: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
    attendance: 62487,
  },
  statistics: {
    home: {
      id: '344e408b-846e-44ac-b491-7802ab0f7af0',
      rushing: {
        totals: {
          attempts: 39,
          touchdowns: 0,
          yards: 78,
        },
        players: [
          {
            id: 'e5b67a2e-e0f7-4646-a343-c9bd0ae447f0',
            attempts: 10,
            touchdowns: 0,
            yards: -4,
          },
          {
            id: 'c90711f2-5c4e-4f2e-8635-0d3f2336f581',
            attempts: 2,
            touchdowns: 0,
            yards: -9,
          },
        ],
      },
      receiving: {
        totals: {
          receptions: 31,
          yards: 257,
        },
        players: [
          {
            id: 'e5b67a2e-e0f7-4646-a343-c9bd0ae447f0',
            receptions: 8,
            yards: 41,
          },
          {
            id: '713daff7-86cc-4283-91a8-1579c3f58f59',
            receptions: 8,
            yards: 88,
          },
        ],
      },
    },
    away: {
      id: 'ba27615c-07df-41f0-864b-332575f744f2',
      rushing: {
        totals: {
          attempts: 37,
          touchdowns: 1,
          yards: 97,
        },
        players: [
          {
            id: '62f377a6-ff87-4784-9631-05c555c4b14a',
            attempts: 12,
            touchdowns: 0,
            yards: 73,
          },
          {
            id: 'e11a2815-8f31-44b0-8c37-64240bcbc059',
            attempts: 14,
            touchdowns: 1,
            yards: 76,
          },
        ],
      },
      receiving: {
        totals: {
          receptions: 27,
          yards: 239,
        },
        players: [
          {
            id: '62f377a6-ff87-4784-9631-05c555c4b14a',
            receptions: 2,
            yards: 39,
          },
          {
            id: 'f94fb8a3-cd77-4064-bc65-447550b43622',
            receptions: 8,
            yards: 46,
          },
        ],
      },
    },
  },
};
