// Route paths for the application
export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  FORGOT_PASSWORD: '/forgot-password',

  // Main app routes
  HOME: '/',
  DISCOVER: '/',

  // Restaurant routes
  RESTAURANT: '/restaurant/:id',
  DISH: '/restaurant/:restaurantId/dish/:dishId',

  // Reservation routes
  RESERVATION: '/reservation',
  RESERVATION_CONFIRM: '/reservation/confirm',

  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order/:orderId/confirmation',

  // User routes
  STATUS: '/status',
  PROFILE: '/profile',
  SETTINGS: '/profile/settings',
  FAVORITES: '/profile/favorites',
  REVIEWS: '/profile/reviews',
  ORDER_HISTORY: '/profile/orders',
  ACHIEVEMENTS: '/profile/achievements',
  PAYMENT_METHODS: '/profile/payment-methods',
};

// Helper to generate dynamic routes
export const getRestaurantRoute = (id) => `/restaurant/${id}`;
export const getDishRoute = (restaurantId, dishId) => `/restaurant/${restaurantId}/dish/${dishId}`;
export const getOrderConfirmationRoute = (orderId) => `/order/${orderId}/confirmation`;
