import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'bonappi_cart_v2';
const DEFAULT_TAX_RATE = 0.0825;
const DEFAULT_MIN_ORDER = 20;

const initialState = {
  restaurantId: null,
  restaurantName: null,
  taxRate: DEFAULT_TAX_RATE,
  minOrder: DEFAULT_MIN_ORDER,
  items: [],
  // { arrivalAt: ISO string, partySize: number }
  reservation: null,
};

// Restore the cart after a reload; storage can be unavailable (private mode)
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.items ? { ...initialState, ...saved } : initialState;
  } catch {
    return initialState;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_RESTAURANT':
      // Clear cart if switching restaurants
      if (state.restaurantId && state.restaurantId !== action.payload.id) {
        return { ...initialState, ...action.payload };
      }
      return { ...state, ...action.payload };

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.dishId === action.payload.dishId &&
          JSON.stringify(item.customizations) ===
            JSON.stringify(action.payload.customizations)
      );

      if (existingIndex >= 0) {
        // Increase quantity of existing item
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      }

      // Add new item
      return {
        ...state,
        items: [...state.items, { ...action.payload, id: Date.now().toString() }],
      };
    }

    case 'UPDATE_ITEM_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'SET_RESERVATION':
      return {
        ...state,
        reservation: action.payload,
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Cart still works for this visit without storage
    }
  }, [state]);

  // Displayed totals; the server recalculates from menu prices at checkout.
  // Tips are left at the table, not prepaid.
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * state.taxRate * 100) / 100;
  const total = subtotal + tax;
  const amountToMinimum = Math.max(0, state.minOrder - subtotal);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    ...state,
    subtotal,
    tax,
    total,
    itemCount,
    amountToMinimum,
    meetsMinimum: amountToMinimum === 0,

    setRestaurant: (restaurant) =>
      dispatch({
        type: 'SET_RESTAURANT',
        payload: {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          taxRate: restaurant.taxRate ?? DEFAULT_TAX_RATE,
          minOrder: restaurant.minOrder ?? DEFAULT_MIN_ORDER,
        },
      }),

    addItem: (item) =>
      dispatch({ type: 'ADD_ITEM', payload: item }),

    updateItemQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { id, quantity } }),

    removeItem: (id) =>
      dispatch({ type: 'REMOVE_ITEM', payload: id }),

    setReservation: (reservation) =>
      dispatch({ type: 'SET_RESERVATION', payload: reservation }),

    clearCart: () =>
      dispatch({ type: 'CLEAR_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
