import { useEffect } from 'react';
import { Package, Clock, Phone, MapPin, X, ArrowLeft } from 'lucide-react';
import useOrderStore from '../store/useOrderStore';
import useProductStore from '../store/useProductStore';
import axiosInstance from '../utilits/axiosInstance';
import { socketService } from '../services/customerSocket.service';
import useUserStore from '../store/useUserStore';
import { useNavigate } from 'react-router';

type OrderStatus = "pending" | "accepted" | "rejected" | "pickup" | "delivered" | "cancelled";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { userData } = useUserStore();
  const { products } = useProductStore();
  const {
    orders,
    setOrders,
    selectedOrder,
    setSelectedOrder,
    isModalOpen,
    setModalOpen,
    updateOrderStatus,
    updateRiderLocation,
    getActiveOrders,
    getCompletedOrders,
    getCancelledOrders
  } = useOrderStore();

  useEffect(() => {
    if (!userData?._id) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/order/user-orders/${userData._id}`);
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    // Initialize socket connection
    socketService.initialize(userData._id);

    return () => {
      socketService.disconnect();
    };
  }, [userData, navigate, setOrders]);

  useEffect(() => {
    if (selectedOrder) {
      socketService.subscribeToOrderUpdates(selectedOrder._id, (update) => {
        if (update.status === "ORDER_ACCEPTED") {
          updateOrderStatus(selectedOrder._id, "accepted");
        } else if (update.status === "ORDER_REJECTED") {
          updateOrderStatus(selectedOrder._id, "rejected");
        } else if (update.status === "PICKUP") {
          updateOrderStatus(selectedOrder._id, "pickup");
        } else if (update.status === "DELIVERED") {
          updateOrderStatus(selectedOrder._id, "delivered");
        }
        
        if (update.rider?.location) {
          updateRiderLocation(selectedOrder._id, {
            coordinates: [update.rider.location.lat, update.rider.location.lng]
          });
        }
      });
    }

    return () => {
      if (selectedOrder) {
        socketService.unsubscribeFromOrderUpdates(selectedOrder._id);
      }
    };
  }, [selectedOrder, updateOrderStatus, updateRiderLocation]);

  const getStatusBadgeClass = (status: OrderStatus) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      pickup: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return `px-3 py-1 rounded-full text-sm ${statusClasses[status]}`;
  };

  const getStatusLabel = (status: OrderStatus) => {
    const statusLabels = {
      pending: 'Waiting for store confirmation',
      accepted: 'Order accepted',
      pickup: 'Out for delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      rejected: 'Rejected'
    };
    return statusLabels[status];
  };

  const getProductDetails = (productId: string) => {
    return products.find(product => product._id === productId);
  };
  
  
  const handleOrderClick = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleOrderClick(order)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={getStatusBadgeClass(order.orderStatus)}>
            {getStatusLabel(order.orderStatus)}
          </span>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="font-bold">₹{order.totalPrice}</p>
      </div>
      <div className="space-y-2">
        {order.items.map((item, idx) => {
          const productDetails = getProductDetails(item.product);
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{productDetails?.productName || item.productName}</span>
              </div>
              <span className="text-gray-600">x{item.quantity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const OrderSection = ({ title, orders }: { title: string; orders: any[] }) => (
    orders.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    )
  );

  const defaultAddress = userData?.address?.[0];
  const formatAddress = () => {
    if (!defaultAddress) return 'Add delivery address';
    
    const parts = [];
    if (defaultAddress.city) parts.push(defaultAddress.city);
    if (defaultAddress.pinCode) parts.push(defaultAddress.pinCode);
    
    return parts.join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-2">
        <div className="flex items-center h-14 mb-2 shadow">
          <button 
            onClick={() => window.history.back()}
            className="mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium">Delivery in 15 minutes</h1>
              <p className="text-xs text-gray-500">
                {formatAddress()}
              </p>
            </div>
          </div>
        </div>
      <h1 className="text-lg font-bold mb-6">My Orders</h1>

      <div className="space-y-8">
        <OrderSection title="Active Orders" orders={getActiveOrders()} />
        <OrderSection title="Completed Orders" orders={getCompletedOrders()} />
        <OrderSection title="Cancelled Orders" orders={getCancelledOrders()} />
      </div>

      {/* Order Details Modal */}
      {selectedOrder && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{selectedOrder._id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={getStatusBadgeClass(selectedOrder.orderStatus)}>
                  {getStatusLabel(selectedOrder.orderStatus)}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, idx) => {
                    const productDetails = getProductDetails(item.product);
                    return (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {productDetails?.productName || item.productName}
                        </span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Payment Details</p>
                <div className="mt-1">
                  <p>Method: {selectedOrder.paymentMethod.toUpperCase()}</p>
                  <p>Status: {selectedOrder.paymentStatus}</p>
                  <p className="font-bold mt-1">Total: ₹{selectedOrder.totalPrice}</p>
                </div>
              </div>

              {selectedOrder.deliveryRider && (
                <div>
                  <p className="text-sm text-gray-500">Delivery Partner</p>
                  <div className="mt-2 space-y-2">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedOrder.deliveryRider.name} - {selectedOrder.deliveryRider.phoneNumber}
                    </p>
                    {selectedOrder.deliveryRider.location && (
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Rider is on the way
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;