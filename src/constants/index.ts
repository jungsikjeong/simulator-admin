
const TABLE_NAMES = {
  MEMBERS: 'members',
}


const QUERY_KEYS = {
  game1Stats: {
    all: () => ['game1-stats'] as const,
    signupDaily: () => [...QUERY_KEYS.game1Stats.all(), 'daily'] as const,
    signupWeekly: () => [...QUERY_KEYS.game1Stats.all(), 'weekly'] as const,
  },
  game2Stats: {
    all: () => ['game2-stats'] as const,
    signupDaily: () => [...QUERY_KEYS.game2Stats.all(), 'daily'] as const,
    signupWeekly: () => [...QUERY_KEYS.game2Stats.all(), 'weekly'] as const,
  },

}


export { QUERY_KEYS, TABLE_NAMES }

