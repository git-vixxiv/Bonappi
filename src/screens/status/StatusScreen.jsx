import { Trophy, Star, Camera, Utensils } from 'lucide-react';
import { Header, ScreenWrapper } from '../../components/layout';
import { Card, Badge } from '../../components/ui';
import { useAuth } from '../../contexts';
import { getUserLevel, getLevelProgress } from '../../constants/levels';

export default function StatusScreen() {
  const { user } = useAuth();

  // Get user level info
  const totalVisits = user?.totalVisits || 0;
  const totalReviews = user?.totalReviews || 0;
  const currentLevel = getUserLevel(totalVisits);
  const { progress, visitsToNext, nextLevel } = getLevelProgress(totalVisits);

  const stats = [
    { label: 'Total Visits', value: totalVisits, icon: Utensils },
    { label: 'Reviews', value: totalReviews, icon: Star },
    { label: 'Photos', value: 12, icon: Camera },
    { label: 'Regular At', value: 2, icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Your Status" />

      <ScreenWrapper className="py-4">
        {/* Level Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {currentLevel.icon}
            </div>
            <div>
              <p className="text-primary-100 text-sm">Current Level</p>
              <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
            </div>
          </div>

          {/* Progress bar */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm text-primary-100 mb-1">
                <span>{progress}% to {nextLevel.name}</span>
                <span>{visitsToNext} visits to go</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!nextLevel && (
            <p className="text-primary-100 text-sm">
              You've reached the highest level!
            </p>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} variant="outlined" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Regular Status Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Your Regular Spots
          </h3>

          {user?.regularRestaurants?.length > 0 ? (
            <div className="space-y-3">
              {/* Regular restaurant cards would go here */}
            </div>
          ) : (
            <Card variant="outlined" className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-1">No Regular spots yet</p>
              <p className="text-sm text-gray-400">
                Visit a restaurant 10 times to become a Regular
              </p>
            </Card>
          )}
        </div>

        {/* Achievements Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Achievements
            </h3>
            <Badge variant="secondary">3/12</Badge>
          </div>

          <Card variant="outlined" className="text-center py-8">
            <p className="text-gray-500">
              Achievements coming soon!
            </p>
          </Card>
        </div>
      </ScreenWrapper>
    </div>
  );
}
