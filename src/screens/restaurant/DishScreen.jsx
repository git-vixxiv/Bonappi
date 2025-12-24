import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Camera,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { Button, Card, Badge, StarRating, Textarea } from '../../components/ui';
import { getRestaurantById } from '../../data/restaurants';
import { getMenuItemById } from '../../data/menuItems';
import { ROUTES } from '../../constants/routes';
import { useCart } from '../../contexts';

export default function DishScreen() {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const { addItem, setRestaurant } = useCart();

  const restaurant = getRestaurantById(restaurantId);
  const dish = getMenuItemById(restaurantId, dishId);

  // Selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCrust, setSelectedCrust] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [comboSelected, setComboSelected] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize defaults when dish loads
  useMemo(() => {
    if (dish?.customizations) {
      const { sizes, crustOptions } = dish.customizations;
      if (sizes?.length && !selectedSize) {
        // Default to medium or first option
        const defaultSize = sizes.find(s => s.priceModifier === 0) || sizes[0];
        setSelectedSize(defaultSize.id);
      }
      if (crustOptions?.length && !selectedCrust) {
        const defaultCrust = crustOptions.find(c => c.priceModifier === 0) || crustOptions[0];
        setSelectedCrust(defaultCrust.id);
      }
    }
  }, [dish]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!dish) return 0;

    let price = dish.basePrice;
    const customizations = dish.customizations || {};

    // Size modifier
    if (selectedSize && customizations.sizes) {
      const size = customizations.sizes.find(s => s.id === selectedSize);
      if (size) price += size.priceModifier;
    }

    // Crust modifier
    if (selectedCrust && customizations.crustOptions) {
      const crust = customizations.crustOptions.find(c => c.id === selectedCrust);
      if (crust) price += crust.priceModifier;
    }

    // Toppings
    if (selectedToppings.length && customizations.toppings) {
      selectedToppings.forEach(toppingId => {
        const topping = customizations.toppings.find(t => t.id === toppingId);
        if (topping) price += topping.price;
      });
    }

    // Combo
    if (comboSelected && customizations.comboOptions?.available) {
      price += customizations.comboOptions.price;
      // Side upcharge
      if (selectedSide && customizations.comboOptions.sides) {
        const side = customizations.comboOptions.sides.find(s => s.id === selectedSide);
        if (side) price += side.priceModifier;
      }
    }

    return price * quantity;
  }, [dish, selectedSize, selectedCrust, selectedToppings, comboSelected, selectedSide, quantity]);

  // Handle topping toggle
  const toggleTopping = (toppingId) => {
    const maxToppings = dish?.customizations?.maxToppings || Infinity;

    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter(id => id !== toppingId));
    } else if (selectedToppings.length < maxToppings) {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  // Handle add to order
  const handleAddToOrder = () => {
    if (!dish || !restaurant) return;

    setRestaurant(restaurantId, restaurant.name);

    addItem({
      dishId: dish.id,
      name: dish.name,
      photo: dish.photo,
      price: totalPrice / quantity,
      quantity,
      customizations: {
        size: selectedSize,
        crust: selectedCrust,
        toppings: selectedToppings,
        combo: comboSelected ? { drink: selectedDrink, side: selectedSide } : null,
        specialInstructions,
      },
    });

    navigate(-1);
  };

  if (!dish || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Dish not found</h1>
          <Button onClick={() => navigate(ROUTES.HOME)}>Go Home</Button>
        </div>
      </div>
    );
  }

  const customizations = dish.customizations || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Hero Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={dish.photo}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
              <Camera className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Dish Info */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{dish.name}</h1>
          <span className="text-xl font-bold text-gray-900">
            ${dish.basePrice.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-500 mb-3">{dish.description}</p>

        {dish.rating && (
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={dish.rating} reviewCount={dish.reviewCount} />
            {dish.dietaryInfo?.map(diet => (
              <Badge key={diet} variant="secondary" size="sm">
                {diet}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Customization Sections */}
      <div className="px-4 space-y-4">

        {/* Size Selection */}
        {customizations.sizes?.length > 0 && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
            <div className="space-y-2">
              {customizations.sizes.map((size) => (
                <label
                  key={size.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${selectedSize === size.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedSize === size.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}
                    `}>
                      {selectedSize === size.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{size.name}</span>
                  </div>
                  <span className="text-gray-600">
                    {size.priceModifier > 0 && '+'}
                    {size.priceModifier !== 0 && `$${size.priceModifier.toFixed(2)}`}
                  </span>
                  <input
                    type="radio"
                    name="size"
                    value={size.id}
                    checked={selectedSize === size.id}
                    onChange={() => setSelectedSize(size.id)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </Card>
        )}

        {/* Crust/Base Options */}
        {customizations.crustOptions?.length > 0 && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Crust</h3>
            <div className="space-y-2">
              {customizations.crustOptions.map((crust) => (
                <label
                  key={crust.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${selectedCrust === crust.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedCrust === crust.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}
                    `}>
                      {selectedCrust === crust.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{crust.name}</span>
                  </div>
                  <span className="text-gray-600">
                    {crust.priceModifier > 0 && '+'}
                    {crust.priceModifier !== 0 && `$${crust.priceModifier.toFixed(2)}`}
                  </span>
                  <input
                    type="radio"
                    name="crust"
                    value={crust.id}
                    checked={selectedCrust === crust.id}
                    onChange={() => setSelectedCrust(crust.id)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </Card>
        )}

        {/* Toppings */}
        {customizations.toppings?.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Toppings</h3>
              {customizations.maxToppings && (
                <span className="text-sm text-gray-500">
                  {selectedToppings.length}/{customizations.maxToppings} selected
                </span>
              )}
            </div>
            <div className="space-y-2">
              {customizations.toppings.map((topping) => {
                const isSelected = selectedToppings.includes(topping.id);
                const isDisabled = !isSelected && selectedToppings.length >= (customizations.maxToppings || Infinity);

                return (
                  <label
                    key={topping.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors
                      ${isSelected
                        ? 'border-primary-600 bg-primary-50'
                        : isDisabled
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        ${isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium text-gray-900">{topping.name}</span>
                    </div>
                    <span className="text-gray-600">+${topping.price.toFixed(2)}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => !isDisabled && toggleTopping(topping.id)}
                      disabled={isDisabled}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          </Card>
        )}

        {/* Combo Options */}
        {customizations.comboOptions?.available && (
          <Card>
            <label className="flex items-center justify-between mb-3 cursor-pointer">
              <div>
                <h3 className="font-semibold text-gray-900">Make it a Combo</h3>
                <p className="text-sm text-gray-500">
                  {customizations.comboOptions.description} - Save ${customizations.comboOptions.discount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  +${customizations.comboOptions.price.toFixed(2)}
                </span>
                <div
                  onClick={() => setComboSelected(!comboSelected)}
                  className={`
                    w-12 h-6 rounded-full transition-colors cursor-pointer
                    ${comboSelected ? 'bg-primary-600' : 'bg-gray-200'}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5
                    ${comboSelected ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </div>
              </div>
            </label>

            {comboSelected && (
              <div className="space-y-4 pt-3 border-t border-gray-100">
                {/* Drink selection */}
                {customizations.comboOptions.drinks?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Choose Drink</h4>
                    <div className="flex flex-wrap gap-2">
                      {customizations.comboOptions.drinks.map((drink) => (
                        <button
                          key={drink}
                          onClick={() => setSelectedDrink(drink)}
                          className={`
                            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                            ${selectedDrink === drink
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {drink}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Side selection */}
                {customizations.comboOptions.sides?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Choose Side</h4>
                    <div className="space-y-2">
                      {customizations.comboOptions.sides.map((side) => (
                        <label
                          key={side.id}
                          className={`
                            flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors
                            ${selectedSide === side.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center
                              ${selectedSide === side.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}
                            `}>
                              {selectedSide === side.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{side.name}</span>
                          </div>
                          {side.priceModifier > 0 && (
                            <span className="text-sm text-gray-500">+${side.priceModifier.toFixed(2)}</span>
                          )}
                          <input
                            type="radio"
                            name="side"
                            value={side.id}
                            checked={selectedSide === side.id}
                            onChange={() => setSelectedSide(side.id)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Special Instructions */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
          <Textarea
            placeholder="Any special requests or modifications..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={3}
          />
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            {/* Quantity selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Total price */}
            <span className="text-2xl font-bold text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <Button fullWidth size="lg" onClick={handleAddToOrder}>
            Add to Order
          </Button>
        </div>
      </div>
    </div>
  );
}
