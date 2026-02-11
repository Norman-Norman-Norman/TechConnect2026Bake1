import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getStatusColor } from '../../../utils/orderUtils';

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

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.orders}`);
  return data;
};

const fetchOrderDetails = async (): Promise<OrderDetail[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.orderDetails}`);
  return data;
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery('orders', fetchOrders);
  const { data: orderDetails, isLoading: detailsLoading } = useQuery('orderDetails', fetchOrderDetails);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const getOrderItemCount = (orderId: number): number => {
    if (!orderDetails) return 0;
    return orderDetails
      .filter(detail => detail.orderId === orderId)
      .reduce((sum, detail) => sum + detail.quantity, 0);
  };

  const getOrderTotal = (orderId: number): number => {
    if (!orderDetails) return 0;
    return orderDetails
      .filter(detail => detail.orderId === orderId)
      .reduce((sum, detail) => sum + detail.quantity * detail.unitPrice, 0);
  };

  if (ordersLoading || detailsLoading) {
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

  if (ordersError) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch orders</div>
        </div>
      </div>
    );
  }

  // Sort orders by date (newest first)
  const sortedOrders = [...(orders || [])].sort((a, b) => 
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Order History
        </h1>

        {sortedOrders.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} rounded-lg shadow-md p-8 text-center transition-colors duration-300`}>
            <p className="text-xl mb-4">No orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map(order => (
              <div
                key={order.orderId}
                onClick={() => navigate(`/orders/${order.orderId}`)}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        Order #{order.orderId}
                      </h2>
                      <span className={`${getStatusColor(order.status)} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-300`}>
                      {order.name}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 transition-colors duration-300`}>
                      {order.description}
                    </p>
                    <div className={`flex flex-wrap gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                      <span>
                        📅 {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      <span>
                        📦 {getOrderItemCount(order.orderId)} items
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary transition-colors duration-300">
                      ${getOrderTotal(order.orderId).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
