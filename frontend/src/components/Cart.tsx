import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { darkMode } = useTheme();
  const { items, removeFromCart, updateQuantity, getSubtotal, getDiscountSavings, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center transition-colors duration-300`}>
            <svg 
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              Add some products to get started!
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discountSavings = getDiscountSavings();
  const total = getTotal();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
              const lineTotal = itemPrice * item.quantity;
              
              return (
                <div 
                  key={item.productId} 
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 transition-colors duration-300`}
                >
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-24 h-24 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg p-2`}>
                      <img 
                        src={`/${item.imgName}`} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.name}
                          </h3>
                          <div className="mt-2">
                            {item.discount ? (
                              <div>
                                <span className="text-gray-500 line-through text-sm mr-2">
                                  ${item.price.toFixed(2)}
                                </span>
                                <span className="text-primary font-semibold">
                                  ${itemPrice.toFixed(2)}
                                </span>
                                <span className="ml-2 text-xs text-primary">
                                  ({Math.round(item.discount * 100)}% OFF)
                                </span>
                              </div>
                            ) : (
                              <span className="text-primary font-semibold">
                                ${item.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            ${lineTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <span aria-hidden="true">-</span>
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium transition-colors duration-300`}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-600 font-medium transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-4">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Subtotal</span>
                  <span>${(subtotal + discountSavings).toFixed(2)}</span>
                </div>
                
                {discountSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Savings</span>
                    <span>-${discountSavings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-600 pt-3">
                  <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/checkout" 
                  className="block w-full bg-primary hover:bg-accent text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  to="/products" 
                  className={`block w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} text-center px-6 py-3 rounded-lg font-medium transition-colors duration-300`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
