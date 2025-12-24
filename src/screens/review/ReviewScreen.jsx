import { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Image,
  X,
  Star,
  Lock,
  Globe,
  Utensils,
  Store,
  UserCheck,
} from 'lucide-react';
import { Button, Card, Textarea, Badge } from '../../components/ui';
import { useAuth } from '../../contexts';
import { getRestaurantById } from '../../data/restaurants';
import { getMenuItemById } from '../../data/menuItems';
import { ROUTES } from '../../constants/routes';

const QUICK_TAGS = [
  'Delicious',
  'Good Value',
  'Large Portion',
  'Authentic',
  'Fresh Ingredients',
  'Great Presentation',
  'Would Order Again',
  'Perfect Seasoning',
  'Comfort Food',
  'Healthy',
];

const RATING_CATEGORIES = [
  { id: 'meal', label: 'Meal', icon: Utensils, description: 'How was the food?' },
  { id: 'restaurant', label: 'Restaurant', icon: Store, description: 'Atmosphere & cleanliness' },
  { id: 'service', label: 'Service', icon: UserCheck, description: 'Staff & experience' },
];

export default function ReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantId, dishId } = useParams();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Get restaurant and dish info
  const restaurant = getRestaurantById(restaurantId);
  const dish = dishId ? getMenuItemById(restaurantId, dishId) : null;

  // Review state
  const [photos, setPhotos] = useState([]);
  const [ratings, setRatings] = useState({
    meal: 0,
    restaurant: 0,
    service: 0,
  });
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [diningNotes, setDiningNotes] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Handle photo selection
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos([...photos, ...newPhotos].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (photoId) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  // Handle rating
  const setRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  // Handle tag toggle
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (ratings.meal === 0) {
      alert('Please rate your meal');
      return;
    }

    setSubmitting(true);

    // In production, this would upload photos and save to database
    const reviewData = {
      id: Date.now().toString(),
      userId: user.id,
      restaurantId,
      dishId,
      photos: photos.map(p => p.preview), // In production, these would be uploaded URLs
      ratings,
      reviewText,
      tags: selectedTags,
      diningNotes,
      isPublic,
      createdAt: new Date().toISOString(),
    };

    console.log('Review submitted:', reviewData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);

    // Navigate back with success
    navigate(-1);
  };

  // Calculate overall rating
  const overallRating = Object.values(ratings).filter(r => r > 0).length > 0
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).filter(r => r > 0).length).toFixed(1)
    : 0;

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Restaurant not found</h1>
          <Button onClick={() => navigate(ROUTES.HOME)}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Write a Review</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Restaurant/Dish Info */}
        <Card>
          <div className="flex items-center gap-3">
            {dish?.photo && (
              <img
                src={dish.photo}
                alt={dish.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="font-semibold text-gray-900">
                {dish ? dish.name : restaurant.name}
              </h2>
              <p className="text-sm text-gray-500">{restaurant.name}</p>
            </div>
          </div>
        </Card>

        {/* Photo Upload */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Add Photos</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* Photo previews */}
            {photos.map((photo) => (
              <div key={photo.id} className="relative flex-shrink-0">
                <img
                  src={photo.preview}
                  alt="Review photo"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add photo buttons */}
            {photos.length < 5 && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-primary-500 hover:bg-primary-50 transition-colors flex-shrink-0"
                >
                  <Camera className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                  capture="environment"
                />
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Add up to 5 photos of your meal
          </p>
        </Card>

        {/* Ratings */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Rate Your Experience</h3>
          <div className="space-y-4">
            {RATING_CATEGORIES.map(({ id, label, icon: Icon, description }) => (
              <div key={id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(id, star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= ratings[id]
                            ? 'fill-gold-500 text-gold-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {overallRating > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">Overall Rating</p>
              <p className="text-2xl font-bold text-primary-600">{overallRating}</p>
            </div>
          )}
        </Card>

        {/* Written Review */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Your Review</h3>
          <Textarea
            placeholder="Tell others about your dining experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-gray-400 mt-2 text-right">
            {reviewText.length}/500
          </p>
        </Card>

        {/* Quick Tags */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Quick Tags</h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${selectedTags.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </Card>

        {/* Dining Notes */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Dining Notes</h3>
            <Badge variant={isPublic ? 'primary' : 'secondary'} size="sm">
              {isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>
          <Textarea
            placeholder="Notes for yourself or others (e.g., 'Ask for extra sauce', 'Great for date night')..."
            value={diningNotes}
            onChange={(e) => setDiningNotes(e.target.value)}
            rows={3}
          />

          {/* Privacy toggle */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-primary-600" />
              ) : (
                <Lock className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {isPublic ? 'Share with others' : 'Keep private'}
                </p>
                <p className="text-xs text-gray-500">
                  {isPublic
                    ? 'Your notes will be visible to other users and the restaurant'
                    : 'Only you can see these notes'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`
                w-12 h-6 rounded-full transition-colors
                ${isPublic ? 'bg-primary-600' : 'bg-gray-200'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5
                ${isPublic ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>
        </Card>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handleSubmit}
            loading={submitting}
            disabled={ratings.meal === 0}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
