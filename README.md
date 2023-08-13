# Game stats

## Installation guide

### Local development

1. `npm i`
2. `npm run dev`

### Running unit tests

1. `npm run test:unit`

## General idea (v1)

### Assumptions

- "The view of all discrepancies for the team" mans only the discrepancies related to team stats, not their players, same goes for the game
- if one of the sources does not give us a value for given metric, we store null as a stat value

### Architecture

1. `game-stats-service` is responsible for aggregating and retrieving stats from external services
2. It then normalizes all possible formats using supported strategies and stores the statistics
3. Every statistic has its own type and values that it describes
4. Discrepancies are then being calculated (ad hoc for the time being) based on provided criteria
