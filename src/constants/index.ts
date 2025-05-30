const TABLE_NAMES = {
  MEMBERS: 'members',
  MEMBERS_2: 'members_2',
  MEMBER_ACTIONS: 'member_actions',
  MEMBER_ACTIONS_2: 'member_actions_2',
}

const QUERY_KEYS = {
  game1Stats: {
    all: () => ['game1-stats'] as const,
    signupDaily: () => [...QUERY_KEYS.game1Stats.all(), 'daily'] as const,
    signupWeekly: () => [...QUERY_KEYS.game1Stats.all(), 'weekly'] as const,
    actionMember: () => [...QUERY_KEYS.game1Stats.all(), TABLE_NAMES.MEMBER_ACTIONS] as const,
  },
  game2Stats: {
    all: () => ['game2-stats'] as const,
    signupDaily: () => [...QUERY_KEYS.game2Stats.all(), 'daily'] as const,
    signupWeekly: () => [...QUERY_KEYS.game2Stats.all(), 'weekly'] as const,
    actionMember: () => [...QUERY_KEYS.game2Stats.all(), TABLE_NAMES.MEMBER_ACTIONS_2] as const,
  },
}

export { QUERY_KEYS, TABLE_NAMES }
