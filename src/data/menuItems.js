// Mock menu items data for development
export const menuItems = {
  // Valentino's Pizzeria
  rest_001: [
    {
      id: 'dish_001',
      restaurantId: 'rest_001',
      name: 'Margherita Pizza',
      description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil',
      category: 'Pizza',
      basePrice: 18.99,
      photo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      rating: 4.9,
      reviewCount: 342,
      dietaryInfo: ['vegetarian'],
      popular: true,
      customizations: {
        sizes: [
          { id: 'personal', name: 'Personal (10")', priceModifier: -4.00 },
          { id: 'medium', name: 'Medium (14")', priceModifier: 0 },
          { id: 'large', name: 'Large (16")', priceModifier: 4.00 },
        ],
        crustOptions: [
          { id: 'traditional', name: 'Traditional Hand Tossed', priceModifier: 0 },
          { id: 'thin', name: 'Thin & Crispy', priceModifier: 1.00 },
          { id: 'deep', name: 'Deep Dish', priceModifier: 2.00 },
          { id: 'gf', name: 'Gluten Free', priceModifier: 3.00 },
        ],
        toppings: [
          { id: 'extra_cheese', name: 'Extra Cheese', price: 1.50 },
          { id: 'mushrooms', name: 'Mushrooms', price: 1.00 },
          { id: 'pepperoni', name: 'Pepperoni', price: 1.50 },
          { id: 'sausage', name: 'Italian Sausage', price: 1.50 },
          { id: 'olives', name: 'Black Olives', price: 1.00 },
          { id: 'peppers', name: 'Bell Peppers', price: 1.00 },
          { id: 'onions', name: 'Red Onions', price: 0.75 },
          { id: 'basil', name: 'Fresh Basil', price: 0.50 },
        ],
        maxToppings: 4,
        comboOptions: {
          available: true,
          discount: 3.00,
          price: 5.99,
          description: 'Add a drink and side',
          drinks: ['Coke', 'Diet Coke', 'Sprite', 'Iced Tea', 'Lemonade'],
          sides: [
            { id: 'salad', name: 'Garden Salad', priceModifier: 0 },
            { id: 'caesar', name: 'Caesar Salad', priceModifier: 1.00 },
            { id: 'knots', name: 'Garlic Knots', priceModifier: 0 },
            { id: 'wings', name: 'Buffalo Wings (6pc)', priceModifier: 2.00 },
          ],
        },
      },
    },
    {
      id: 'dish_002',
      restaurantId: 'rest_001',
      name: 'Pepperoni Lovers',
      description: 'Double pepperoni, mozzarella, marinara sauce, Italian herbs',
      category: 'Pizza',
      basePrice: 21.99,
      photo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
      rating: 4.7,
      reviewCount: 289,
      dietaryInfo: [],
      popular: true,
      customizations: {
        sizes: [
          { id: 'personal', name: 'Personal (10")', priceModifier: -4.00 },
          { id: 'medium', name: 'Medium (14")', priceModifier: 0 },
          { id: 'large', name: 'Large (16")', priceModifier: 4.00 },
        ],
        crustOptions: [
          { id: 'traditional', name: 'Traditional Hand Tossed', priceModifier: 0 },
          { id: 'thin', name: 'Thin & Crispy', priceModifier: 1.00 },
          { id: 'deep', name: 'Deep Dish', priceModifier: 2.00 },
        ],
        toppings: [
          { id: 'extra_cheese', name: 'Extra Cheese', price: 1.50 },
          { id: 'mushrooms', name: 'Mushrooms', price: 1.00 },
          { id: 'olives', name: 'Black Olives', price: 1.00 },
          { id: 'peppers', name: 'Bell Peppers', price: 1.00 },
          { id: 'jalapenos', name: 'Jalapenos', price: 0.75 },
        ],
        maxToppings: 3,
      },
    },
    {
      id: 'dish_003',
      restaurantId: 'rest_001',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      category: 'Desserts',
      basePrice: 9.99,
      photo: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
      rating: 4.8,
      reviewCount: 156,
      dietaryInfo: ['vegetarian'],
      popular: false,
    },
    {
      id: 'dish_004',
      restaurantId: 'rest_001',
      name: 'Caesar Salad',
      description: 'Romaine, parmesan, croutons, house-made Caesar dressing',
      category: 'Salads',
      basePrice: 12.99,
      photo: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800',
      rating: 4.4,
      reviewCount: 98,
      dietaryInfo: ['vegetarian'],
      popular: false,
      customizations: {
        addOns: [
          { id: 'chicken', name: 'Grilled Chicken', price: 4.00 },
          { id: 'shrimp', name: 'Grilled Shrimp', price: 6.00 },
          { id: 'anchovies', name: 'Anchovies', price: 2.00 },
        ],
      },
    },
  ],

  // Torchy's Tacos
  rest_004: [
    {
      id: 'dish_101',
      restaurantId: 'rest_004',
      name: 'Trailer Park',
      description: 'Fried chicken, green chiles, lettuce, pico, cheese, poblano sauce. Get it "Trashy" - add queso!',
      category: 'Tacos',
      basePrice: 4.50,
      photo: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800',
      rating: 4.8,
      reviewCount: 1205,
      dietaryInfo: [],
      popular: true,
      customizations: {
        style: [
          { id: 'regular', name: 'Regular', priceModifier: 0 },
          { id: 'trashy', name: 'Make it Trashy (add queso)', priceModifier: 1.00 },
        ],
        tortilla: [
          { id: 'flour', name: 'Flour Tortilla', priceModifier: 0 },
          { id: 'corn', name: 'Corn Tortilla', priceModifier: 0 },
        ],
        extras: [
          { id: 'extra_cheese', name: 'Extra Cheese', price: 0.75 },
          { id: 'guac', name: 'Guacamole', price: 1.50 },
          { id: 'jalapenos', name: 'Fresh Jalapenos', price: 0.50 },
        ],
      },
    },
    {
      id: 'dish_102',
      restaurantId: 'rest_004',
      name: 'Democrat',
      description: 'Barbacoa, avocado, cotija, cilantro, onions, lime, salsa verde',
      category: 'Tacos',
      basePrice: 4.95,
      photo: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
      rating: 4.6,
      reviewCount: 876,
      dietaryInfo: ['gluten-free'],
      popular: true,
      customizations: {
        tortilla: [
          { id: 'flour', name: 'Flour Tortilla', priceModifier: 0 },
          { id: 'corn', name: 'Corn Tortilla', priceModifier: 0 },
        ],
        extras: [
          { id: 'extra_meat', name: 'Extra Barbacoa', price: 2.00 },
          { id: 'guac', name: 'Extra Guacamole', price: 1.50 },
          { id: 'sour_cream', name: 'Sour Cream', price: 0.50 },
        ],
      },
    },
    {
      id: 'dish_103',
      restaurantId: 'rest_004',
      name: 'Green Chile Queso',
      description: 'House-made queso with roasted green chiles, served with chips',
      category: 'Starters',
      basePrice: 5.25,
      photo: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=800',
      rating: 4.7,
      reviewCount: 654,
      dietaryInfo: ['vegetarian', 'gluten-free'],
      popular: true,
      customizations: {
        size: [
          { id: 'regular', name: 'Regular', priceModifier: 0 },
          { id: 'large', name: 'Large', priceModifier: 2.50 },
        ],
        addOns: [
          { id: 'guac', name: 'Add Guacamole', price: 1.50 },
          { id: 'beef', name: 'Add Ground Beef', price: 2.00 },
          { id: 'chorizo', name: 'Add Chorizo', price: 2.00 },
        ],
      },
    },
    {
      id: 'dish_104',
      restaurantId: 'rest_004',
      name: 'Breakfast Taco - Migas',
      description: 'Eggs, crispy tortilla strips, cheese, pico, salsa verde',
      category: 'Breakfast',
      basePrice: 3.75,
      photo: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800',
      rating: 4.5,
      reviewCount: 432,
      dietaryInfo: ['vegetarian'],
      popular: false,
      customizations: {
        tortilla: [
          { id: 'flour', name: 'Flour Tortilla', priceModifier: 0 },
          { id: 'corn', name: 'Corn Tortilla', priceModifier: 0 },
        ],
        addOns: [
          { id: 'bacon', name: 'Add Bacon', price: 1.50 },
          { id: 'chorizo', name: 'Add Chorizo', price: 1.50 },
          { id: 'avocado', name: 'Add Avocado', price: 1.00 },
        ],
      },
    },
  ],

  // Ramen Tatsu-Ya
  rest_006: [
    {
      id: 'dish_201',
      restaurantId: 'rest_006',
      name: 'Tonkotsu Original',
      description: '18-hour pork bone broth, chashu pork, seasoned egg, green onions, nori',
      category: 'Ramen',
      basePrice: 15.00,
      photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      rating: 4.9,
      reviewCount: 1567,
      dietaryInfo: [],
      popular: true,
      customizations: {
        noodleTexture: [
          { id: 'soft', name: 'Soft', priceModifier: 0 },
          { id: 'regular', name: 'Regular', priceModifier: 0 },
          { id: 'firm', name: 'Firm', priceModifier: 0 },
        ],
        brothRichness: [
          { id: 'light', name: 'Light', priceModifier: 0 },
          { id: 'regular', name: 'Regular', priceModifier: 0 },
          { id: 'rich', name: 'Rich', priceModifier: 0 },
        ],
        spiceLevel: [
          { id: 'none', name: 'No Spice', priceModifier: 0 },
          { id: 'mild', name: 'Mild', priceModifier: 0 },
          { id: 'medium', name: 'Medium', priceModifier: 0 },
          { id: 'hot', name: 'Hot', priceModifier: 0 },
        ],
        extras: [
          { id: 'extra_egg', name: 'Extra Egg', price: 2.00 },
          { id: 'extra_chashu', name: 'Extra Chashu (3pc)', price: 4.00 },
          { id: 'extra_noodles', name: 'Extra Noodles', price: 2.50 },
          { id: 'corn', name: 'Sweet Corn', price: 1.00 },
          { id: 'garlic', name: 'Roasted Garlic', price: 0.75 },
          { id: 'mushrooms', name: 'Wood Ear Mushrooms', price: 1.50 },
        ],
      },
    },
    {
      id: 'dish_202',
      restaurantId: 'rest_006',
      name: 'Tsukemen',
      description: 'Dipping ramen with thick noodles and concentrated pork broth',
      category: 'Ramen',
      basePrice: 17.00,
      photo: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800',
      rating: 4.8,
      reviewCount: 892,
      dietaryInfo: [],
      popular: true,
      customizations: {
        size: [
          { id: 'regular', name: 'Regular', priceModifier: 0 },
          { id: 'large', name: 'Large Noodles', priceModifier: 3.00 },
        ],
        extras: [
          { id: 'extra_egg', name: 'Extra Egg', price: 2.00 },
          { id: 'extra_chashu', name: 'Extra Chashu', price: 4.00 },
        ],
      },
    },
    {
      id: 'dish_203',
      restaurantId: 'rest_006',
      name: 'Vegetarian Ramen',
      description: 'Mushroom and kombu broth, tofu, seasonal vegetables, nori',
      category: 'Ramen',
      basePrice: 14.00,
      photo: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800',
      rating: 4.5,
      reviewCount: 324,
      dietaryInfo: ['vegetarian', 'vegan-option'],
      popular: false,
      customizations: {
        noodleTexture: [
          { id: 'soft', name: 'Soft', priceModifier: 0 },
          { id: 'regular', name: 'Regular', priceModifier: 0 },
          { id: 'firm', name: 'Firm', priceModifier: 0 },
        ],
        extras: [
          { id: 'extra_tofu', name: 'Extra Tofu', price: 2.00 },
          { id: 'corn', name: 'Sweet Corn', price: 1.00 },
          { id: 'mushrooms', name: 'Extra Mushrooms', price: 1.50 },
        ],
      },
    },
    {
      id: 'dish_204',
      restaurantId: 'rest_006',
      name: 'Gyoza',
      description: 'Pan-fried pork dumplings with ponzu dipping sauce',
      category: 'Appetizers',
      basePrice: 8.00,
      photo: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      rating: 4.6,
      reviewCount: 456,
      dietaryInfo: [],
      popular: false,
      customizations: {
        quantity: [
          { id: '6pc', name: '6 pieces', priceModifier: 0 },
          { id: '12pc', name: '12 pieces', priceModifier: 6.00 },
        ],
      },
    },
  ],
};

// Helper functions
export const getMenuByRestaurant = (restaurantId) => menuItems[restaurantId] || [];

export const getMenuItemById = (restaurantId, dishId) => {
  const items = menuItems[restaurantId] || [];
  return items.find((item) => item.id === dishId);
};

export const getPopularItems = (restaurantId) => {
  const items = menuItems[restaurantId] || [];
  return items.filter((item) => item.popular);
};

export const getItemsByCategory = (restaurantId) => {
  const items = menuItems[restaurantId] || [];
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
};

export const searchMenuItems = (restaurantId, query) => {
  const items = menuItems[restaurantId] || [];
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );
};
