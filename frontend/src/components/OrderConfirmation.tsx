import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/config';

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  status: string;
  name: string;
  description: string;
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
  imgName: string;
}

export default function OrderConfirmation() {
  const { darkMode } = useTheme();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Fetch order
        const orderResponse = await axios.get(`${api.baseURL}${api.endpoints.orders}/${orderId}`);
        setOrder(orderResponse.data);

        // Fetch all order details
        const detailsResponse = await axios.get(`${api.baseURL}${api.endpoints.orderDetails}`);
        const allDetails = detailsResponse.data;
        const orderDetailsForThisOrder = allDetails.filter(
          (detail: OrderDetail) => detail.orderId === parseInt(orderId || '0')
        );
        setOrderDetails(orderDetailsForThisOrder);

        // Fetch products for display
        const productsResponse = await axios.get(`${api.baseURL}${api.endpoints.products}`);
        setProducts(productsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order data:', err);
        setError('Failed to load order details.');
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center transition-colors duration-300`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Order Not Found
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              {error || 'The order you are looking for does not exist.'}
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

  const total = orderDetails.reduce((sum, detail) => sum + detail.unitPrice * detail.quantity, 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 mb-6 text-center transition-colors duration-300`}>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg 
                className="h-12 w-12 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>
            Order Confirmed!
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 transition-colors duration-300`}>
            Thank you for your order, {order.name}!
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
            Order Number: <span className="font-bold text-primary">#{order.orderId}</span>
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 transition-colors duration-300`}>
            Order Date: {new Date(order.orderDate).toLocaleString()}
          </p>
        </div>

        {/* Order Details */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
            Order Details
          </h2>
          
          <div className="space-y-4">
            {orderDetails.map(detail => {
              const product = products.find(p => p.productId === detail.productId);
              const lineTotal = detail.unitPrice * detail.quantity;
              
              return (
                <div 
                  key={detail.orderDetailId} 
                  className={`flex gap-4 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}
                >
                  {product && (
                    <div className={`flex-shrink-0 w-20 h-20 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg p-2`}>
                      <img 
                        src={`/${product.imgName}`} 
                        alt={product.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {product?.name || `Product #${detail.productId}`}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                          Quantity: {detail.quantity}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                          Unit Price: ${detail.unitPrice.toFixed(2)}
                        </p>
                        {detail.notes && (
                          <p className="text-sm text-green-600 mt-1">
                            {detail.notes}
                          </p>
                        )}
                      </div>
                      <div className={`text-right font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        ${lineTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
            Delivery Information
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>
            <span className="font-semibold">Status:</span> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </p>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 transition-colors duration-300`}>
            <span className="font-semibold">Estimated Delivery:</span> 3-5 business days
          </p>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            {order.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/products" 
            className="flex-1 bg-primary hover:bg-accent text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/" 
            className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} text-center px-6 py-3 rounded-lg font-medium transition-colors duration-300`}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
