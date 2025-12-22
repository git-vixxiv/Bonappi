// User level definitions for gamification
export const USER_LEVELS = [
  {
    id: 'new_diner',
    name: 'New Diner',
    minVisits: 0,
    maxVisits: 5,
    icon: '🍽️',
    color: '#9CA3AF', // gray-400
    description: 'Just getting started on your culinary journey',
  },
  {
    id: 'food_explorer',
    name: 'Food Explorer',
    minVisits: 6,
    maxVisits: 15,
    icon: '🧭',
    color: '#3B82F6', // blue-500
    description: 'Discovering new flavors and restaurants',
  },
  {
    id: 'regular',
    name: 'Regular',
    minVisits: 16,
    maxVisits: 30,
    icon: '⭐',
    color: '#F59E0B', // amber-500
    description: 'A familiar face at your favorite spots',
  },
  {
    id: 'connoisseur',
    name: 'Connoisseur',
    minVisits: 31,
    maxVisits: 50,
    icon: '🏆',
    color: '#8B5CF6', // violet-500
    description: 'Your refined taste is well known',
  },
  {
    id: 'dining_elite',
    name: 'Dining Elite',
    minVisits: 51,
    maxVisits: Infinity,
    icon: '👑',
    color: '#EF4444', // red-500
    description: 'The pinnacle of dining excellence',
  },
];

// Restaurant-specific regular status threshold
export const REGULAR_THRESHOLD = 10;

// Helper to get user level based on total visits
export const getUserLevel = (totalVisits) => {
  return USER_LEVELS.find(
    (level) => totalVisits >= level.minVisits && totalVisits <= level.maxVisits
  ) || USER_LEVELS[0];
};

// Helper to get progress to next level
export const getLevelProgress = (totalVisits) => {
  const currentLevel = getUserLevel(totalVisits);
  const currentLevelIndex = USER_LEVELS.indexOf(currentLevel);

  if (currentLevelIndex === USER_LEVELS.length - 1) {
    return { progress: 100, visitsToNext: 0, nextLevel: null };
  }

  const nextLevel = USER_LEVELS[currentLevelIndex + 1];
  const visitsInCurrentLevel = totalVisits - currentLevel.minVisits;
  const visitsNeededForLevel = nextLevel.minVisits - currentLevel.minVisits;
  const progress = Math.round((visitsInCurrentLevel / visitsNeededForLevel) * 100);
  const visitsToNext = nextLevel.minVisits - totalVisits;

  return { progress, visitsToNext, nextLevel };
};
