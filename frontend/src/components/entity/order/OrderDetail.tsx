import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import { getStatusColor, getStatusSteps, pluralize } from '../../../utils/orderUtils';

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  name: string;
  description: string;
  status: string;
}

interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  notes: string;
}

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

const fetchOrder = async (orderId: string): Promise<Order> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.orders}/${orderId}`);
  return data;
};

const fetchOrderDetails = async (): Promise<OrderDetail[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.orderDetails}`);
  return data;
};

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

export default function OrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState<string>('');

  const { data: order, isLoading: orderLoading, error: orderError } = useQuery(
    ['order', id],
    () => fetchOrder(id!),
    { enabled: !!id }
  );

  const { data: allOrderDetails, isLoading: detailsLoading } = useQuery('orderDetails', fetchOrderDetails);
  const { data: products, isLoading: productsLoading } = useQuery('products', fetchProducts);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const orderDetails = allOrderDetails?.filter(detail => detail.orderId === Number(id)) || [];

  useEffect(() => {
    if (notification) {
      const timeoutId = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [notification]);

  const handleReorder = () => {
    let addedCount = 0;
    let skippedCount = 0;

    orderDetails.forEach(detail => {
      const product = products?.find(p => p.productId === detail.productId);
      
      if (product) {
        // Use current price, not historical price
        // Note: discount is stored as decimal (0.25 = 25% off)
        const currentPrice = product.discount 
          ? product.price * (1 - product.discount)
          : product.price;
        
        addToCart({
          productId: product.productId,
          name: product.name,
          price: currentPrice,
          quantity: detail.quantity,
          imgName: product.imgName,
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    });

    let message = `${addedCount} ${pluralize(addedCount, 'item')} added to cart`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} unavailable ${pluralize(skippedCount, 'item')} ${skippedCount === 1 ? 'was' : 'were'} skipped.`;
    }
    
    setNotification(message);
  };

  if (orderLoading || detailsLoading || productsLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Order not found</div>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/orders')}
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderTotal = orderDetails.reduce((sum, detail) => sum + detail.quantity * detail.unitPrice, 0);
  const statusSteps = getStatusSteps(order.status);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className="fixed top-24 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {notification}
            <button
              onClick={() => navigate('/cart')}
              className="ml-4 underline hover:text-gray-200"
            >
              View Cart
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className={`mb-6 flex items-center ${darkMode ? 'text-gray-400 hover:text-light' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-300`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        {/* Order Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  Order #{order.orderId}
                </h1>
                <span className={`${getStatusColor(order.status)} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase`}>
                  {order.status}
                </span>
              </div>
              <h2 className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-300`}>
                {order.name}
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                {order.description}
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-2 transition-colors duration-300`}>
                Order Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary transition-colors duration-300">
                ${orderTotal.toFixed(2)}
              </div>
              <button
                onClick={handleReorder}
                className="mt-4 bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                🔄 Reorder
              </button>
            </div>
          </div>

          {/* Status Progress */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              {statusSteps.map((step, index) => (
                <div key={step.label} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                        ${step.completed || step.active
                          ? 'bg-primary text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-300 text-gray-600'
                        } transition-colors duration-300`}
                    >
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <span className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                      {step.label}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 -mt-6
                        ${step.completed
                          ? 'bg-primary'
                          : darkMode
                          ? 'bg-gray-700'
                          : 'bg-gray-300'
                        } transition-colors duration-300`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-colors duration-300`}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Order Items
            </h3>
            <div className="space-y-4">
              {orderDetails.map(detail => {
                const product = products?.find(p => p.productId === detail.productId);
                const lineTotal = detail.quantity * detail.unitPrice;
                
                return (
                  <div
                    key={detail.orderDetailId}
                    className={`flex flex-col sm:flex-row gap-4 p-4 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}
                  >
                    {product && (
                      <div className={`w-full sm:w-24 h-24 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                        <img
                          src={`/${product.imgName}`}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        {product?.name || `Product ID ${detail.productId}`}
                      </h4>
                      {product && (
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>
                          {product.description}
                        </p>
                      )}
                      {detail.notes && (
                        <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm italic mt-1 transition-colors duration-300`}>
                          Note: {detail.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right sm:min-w-[150px]">
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        ${detail.unitPrice.toFixed(2)} × {detail.quantity}
                      </div>
                      <div className="text-lg font-bold text-primary transition-colors duration-300">
                        ${lineTotal.toFixed(2)}
                      </div>
                      {product && (
                        (() => {
                          const currentPrice = product.discount 
                            ? product.price * (1 - product.discount)
                            : product.price;
                          return currentPrice !== detail.unitPrice && (
                            <div className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-1 transition-colors duration-300`}>
                              Current price: ${currentPrice.toFixed(2)}
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Total */}
            <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  Total
                </span>
                <span className="text-2xl font-bold text-primary transition-colors duration-300">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
