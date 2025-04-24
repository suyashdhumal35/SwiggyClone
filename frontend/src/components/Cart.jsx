import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  incrementQuantity, 
  decrementQuantity, 
  removeItem, 
  clearCart 
} from '../redux/cartSlice';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full md:w-4/6 mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 md:space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row justify-between p-3 md:p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium text-sm md:text-base">{item.name}</h3>
                    <p className="text-gray-500 text-xs md:text-sm">₹{item.price} each</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end sm:space-x-3 md:space-x-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => dispatch(decrementQuantity(item.id))}
                      className="px-2 py-1 md:px-3 md:py-1 bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-base">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(incrementQuantity(item.id))}
                      className="px-2 py-1 md:px-3 md:py-1 bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="w-16 md:w-20 text-right font-medium text-sm md:text-base">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-red-500 hover:text-red-700 ml-2 md:ml-4 text-sm md:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between font-bold text-base md:text-lg">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="mt-3 md:mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm md:text-base"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;