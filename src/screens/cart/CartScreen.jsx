import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import ArrivalPicker from '../../components/cart/ArrivalPicker';
import { useCart } from '../../contexts';
import { useRestaurant } from '../../hooks/useRestaurants';
import { ROUTES, getRestaurantRoute } from '../../constants/routes';

// A saved arrival time must still be at least this far in the future
const MIN_LEAD_MS = 25 * 60 * 1000;

export default function CartScreen() {
  const navigate = useNavigate();
  const {
    restaurantId,
    restaurantName,
    items,
    itemCount,
    subtotal,
    tax,
    total,
    minOrder,
    amountToMinimum,
    meetsMinimum,
    reservation,
    setReservation,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { data } = useRestaurant(restaurantId);
  const restaurant = data?.restaurant;

  // Checked at render so a time saved yesterday doesn't slip through
  // eslint-disable-next-line react-hooks/purity
  const arrivalValid = !!reservation?.arrivalAt && Date.parse(reservation.arrivalAt) - Date.now() > MIN_LEAD_MS;
  const canCheckout = meetsMinimum && arrivalValid;

  const handleCheckout = () => {
    if (canCheckout) navigate(ROUTES.CHECKOUT);
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Your Order</h1>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center mb-6 max-w-xs">
            Looks like you haven't added anything yet. Find a restaurant and start ordering!
          </p>
          <Button onClick={() => navigate(ROUTES.HOME)}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-48">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Your Order</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-error-500 font-medium hover:text-error-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Restaurant info */}
        <Card
          hoverable
          onClick={() => navigate(getRestaurantRoute(restaurantId))}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{restaurantName}</h2>
            <p className="text-sm text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
        </Card>

        {/* Cart items */}
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex gap-3">
                  {/* Item image */}
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}

                  {/* Item details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <span className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Customizations summary */}
                    {item.customizations && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {formatCustomizations(item.customizations)}
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-4 h-4 text-error-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-error-500 font-medium hover:text-error-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add more items */}
        <button
          onClick={() => navigate(getRestaurantRoute(restaurantId))}
          className="w-full py-3 text-primary-600 font-medium text-center hover:bg-primary-50 rounded-lg transition-colors"
        >
          + Add more items
        </button>

        {/* Arrival time + party size */}
        {restaurant && (
          <ArrivalPicker restaurant={restaurant} value={reservation} onChange={setReservation} />
        )}

        {/* Order summary */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              Paid now so your food is ready when you arrive. Tip your server at the table.
            </p>
          </div>
        </Card>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto space-y-3">
          {!meetsMinimum ? (
            <p className="text-sm text-center text-gray-600">
              Add ${amountToMinimum.toFixed(2)} more to reach the ${minOrder.toFixed(0)} minimum
            </p>
          ) : !arrivalValid ? (
            <p className="text-sm text-center text-gray-600">Choose your arrival time above</p>
          ) : null}

          <Button fullWidth size="lg" onClick={handleCheckout} disabled={!canCheckout}>
            Continue to Checkout · ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper to format customizations for display
function formatCustomizations(customizations) {
  const parts = [];

  if (customizations.size) {
    parts.push(customizations.size);
  }
  if (customizations.crust) {
    parts.push(customizations.crust);
  }
  if (customizations.toppings?.length) {
    parts.push(`${customizations.toppings.length} topping${customizations.toppings.length > 1 ? 's' : ''}`);
  }
  if (customizations.combo) {
    parts.push('Combo');
  }
  if (customizations.specialInstructions) {
    parts.push(`"${customizations.specialInstructions.substring(0, 30)}..."`);
  }

  return parts.join(' • ') || 'No customizations';
}
