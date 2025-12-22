import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  reservation: null,
  tip: { percentage: 18, amount: 0 },
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_RESTAURANT':
      // Clear cart if switching restaurants
      if (state.restaurantId && state.restaurantId !== action.payload.id) {
        return {
          ...initialState,
          restaurantId: action.payload.id,
          restaurantName: action.payload.name,
        };
      }
      return {
        ...state,
        restaurantId: action.payload.id,
        restaurantName: action.payload.name,
      };

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

    case 'SET_TIP':
      return {
        ...state,
        tip: action.payload,
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate totals
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.0825; // 8.25% tax (Austin, TX rate)
  const tipAmount = state.tip.percentage
    ? subtotal * (state.tip.percentage / 100)
    : state.tip.amount;
  const total = subtotal + tax + tipAmount;

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    ...state,
    subtotal,
    tax,
    tipAmount,
    total,
    itemCount,

    setRestaurant: (id, name) =>
      dispatch({ type: 'SET_RESTAURANT', payload: { id, name } }),

    addItem: (item) =>
      dispatch({ type: 'ADD_ITEM', payload: item }),

    updateItemQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { id, quantity } }),

    removeItem: (id) =>
      dispatch({ type: 'REMOVE_ITEM', payload: id }),

    setReservation: (reservation) =>
      dispatch({ type: 'SET_RESERVATION', payload: reservation }),

    setTip: (tip) =>
      dispatch({ type: 'SET_TIP', payload: tip }),

    clearCart: () =>
      dispatch({ type: 'CLEAR_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
