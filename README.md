# Game stats

## Installation guide

### Local development

1. `nvm use`
2. `npm i`
3. `npm run dev`
4. App is available at `http://localhost:5173`
5. Swagger is available at `http://localhost:3000/api`

### Running tests

1. `npm run test:unit`

## General idea

### Assumptions

- "The view of all discrepancies for the team" means only the discrepancies related to team stats, not their players, same goes for the game
- If one of the sources does not give us a value for given metric, we store null as a stat value, which is then also treated as a discrepancy
- As I am not sure how the stats/discrepancies data is going to be used and what might be the full requirements I decided to go with in-memory db, as it fits the task I was given
- Ignoring discrepancies means to ignore individual metric for one of the sources, not all discrepancies for the same stat

### Solution overview

1. `game-stats-service` and providers are responsible for aggregating and retrieving stats from external services
2. Then they normalize all possible formats using supported strategies and persists the statistics
3. Every statistic has its own type and values that it describes
4. Discrepancies are then being calculated (ad hoc for the time being) based on provided criteria and on persisted game stats
5. Discrepancies can be filtered on the UI using either top dropdown or applying filters on specific columns

### Generating discrepancies from game stats

```json
{
  "15adf794-5630-4dc4-b0e7-f8d437b585b1_TEAM_ba27615c-07df-41f0-864b-332575f744f2": [
    {
      "gameId": "15adf794-5630-4dc4-b0e7-f8d437b585b1",
      "sourceId": "sr",
      "statType": "TEAM",
      "teamId": "ba27615c-07df-41f0-864b-332575f744f2",
      "stats": {
        "receivingReceptions": 27,
        "receivingYards": 239,
        "rushTouchdowns": 1,
        "rushYards": 97,
        "rushAttempts": 37
      }
    },
    {
      "gameId": "15adf794-5630-4dc4-b0e7-f8d437b585b1",
      "sourceId": "external",
      "statType": "TEAM",
      "teamId": "ba27615c-07df-41f0-864b-332575f744f2",
      "stats": {
        "receivingReceptions": 27,
        "rushTouchdowns": 1,
        "rushYards": 105,
        "rushAttempts": 37,
        "receivingYards": 230
      }
    }
  ]
}
```

is converted to

```json
[
  {
    "meta": {
      "id": "15adf794-5630-4dc4-b0e7-f8d437b585b1_TEAM_ba27615c-07df-41f0-864b-332575f744f2_receivingYards",
      "gameId": "15adf794-5630-4dc4-b0e7-f8d437b585b1",
      "statType": "TEAM",
      "teamId": "ba27615c-07df-41f0-864b-332575f744f2"
    },
    "statName": "receivingYards",
    "values": [
      {
        "sourceId": "sr",
        "value": 239
      },
      {
        "sourceId": "external",
        "value": 230
      }
    ]
  },
  {
    "meta": {
      "id": "15adf794-5630-4dc4-b0e7-f8d437b585b1_TEAM_ba27615c-07df-41f0-864b-332575f744f2_rushYards",
      "gameId": "15adf794-5630-4dc4-b0e7-f8d437b585b1",
      "statType": "TEAM",
      "teamId": "ba27615c-07df-41f0-864b-332575f744f2"
    },
    "statName": "rushYards",
    "values": [
      {
        "sourceId": "sr",
        "value": 97
      },
      {
        "sourceId": "external",
        "value": 105
      }
    ]
  }
]
```
