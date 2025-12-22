// Achievement definitions for gamification
export const ACHIEVEMENTS = [
  // Milestone achievements
  {
    id: 'first_review',
    name: 'First Review',
    description: 'Posted your first review',
    icon: '✍️',
    category: 'milestones',
    requirement: { type: 'reviews', count: 1 },
  },
  {
    id: 'ten_restaurants',
    name: 'Restaurant Explorer',
    description: 'Visited 10 different restaurants',
    icon: '🗺️',
    category: 'milestones',
    requirement: { type: 'unique_restaurants', count: 10 },
  },
  {
    id: 'fifty_dishes',
    name: 'Culinary Adventurer',
    description: 'Tried 50 different dishes',
    icon: '🍴',
    category: 'milestones',
    requirement: { type: 'unique_dishes', count: 50 },
  },
  {
    id: 'hundred_meals',
    name: 'Century Diner',
    description: 'Logged 100 meals',
    icon: '💯',
    category: 'milestones',
    requirement: { type: 'orders', count: 100 },
  },

  // Regular status achievements
  {
    id: 'first_regular',
    name: 'Hometown Hero',
    description: 'Became a Regular at your first restaurant',
    icon: '🏠',
    category: 'regular',
    requirement: { type: 'regular_status', count: 1 },
  },
  {
    id: 'three_regulars',
    name: 'Local Legend',
    description: 'Regular at 3 different restaurants',
    icon: '🌟',
    category: 'regular',
    requirement: { type: 'regular_status', count: 3 },
  },
  {
    id: 'five_regulars',
    name: 'Neighborhood Icon',
    description: 'Regular at 5 different restaurants',
    icon: '👑',
    category: 'regular',
    requirement: { type: 'regular_status', count: 5 },
  },

  // Photo achievements
  {
    id: 'first_photo',
    name: 'Shutterbug',
    description: 'Uploaded your first food photo',
    icon: '📸',
    category: 'photos',
    requirement: { type: 'photos', count: 1 },
  },
  {
    id: 'fifty_photos',
    name: 'Food Photographer',
    description: 'Uploaded 50 food photos',
    icon: '🎞️',
    category: 'photos',
    requirement: { type: 'photos', count: 50 },
  },

  // Time-based achievements
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Placed 5 orders before 9 AM',
    icon: '🌅',
    category: 'timing',
    requirement: { type: 'morning_orders', count: 5 },
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Placed 5 orders after 9 PM',
    icon: '🌙',
    category: 'timing',
    requirement: { type: 'evening_orders', count: 5 },
  },

  // Cuisine exploration
  {
    id: 'world_traveler',
    name: 'World Traveler',
    description: 'Tried 10 different cuisine types',
    icon: '🌍',
    category: 'exploration',
    requirement: { type: 'unique_cuisines', count: 10 },
  },
];

// Achievement categories for filtering
export const ACHIEVEMENT_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'milestones', name: 'Milestones' },
  { id: 'regular', name: 'Regular Status' },
  { id: 'photos', name: 'Photography' },
  { id: 'timing', name: 'Timing' },
  { id: 'exploration', name: 'Exploration' },
];

// Helper to check if achievement is unlocked
export const isAchievementUnlocked = (achievement, userStats) => {
  const { type, count } = achievement.requirement;
  const userValue = userStats[type] || 0;
  return userValue >= count;
};

// Helper to get achievement progress
export const getAchievementProgress = (achievement, userStats) => {
  const { type, count } = achievement.requirement;
  const userValue = userStats[type] || 0;
  return Math.min(Math.round((userValue / count) * 100), 100);
};
