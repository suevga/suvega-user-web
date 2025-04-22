import { useEffect, useState } from 'react';
import { Package, Clock, Phone, MapPin, X, ArrowLeft } from 'lucide-react';
import useOrderStore from '../store/useOrderStore';
import useProductStore from '../store/useProductStore';
import axiosInstance from '../utilits/axiosInstance';
import { socketService } from '../services/customerSocket.service';
import useUserStore from '../store/useUserStore';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import { Helmet } from 'react-helmet-async';
type OrderStatus = "pending" | "accepted" | "rejected" | "pickup" | "delivered" | "cancelled";

// Remove our custom OrderUpdate interface and use any for now
// This avoids conflicts with the type defined in the socket service

const OrderHistory = () => {
  const navigate = useNavigate();
  const { userData } = useUserStore();
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const {
    orders,
    setOrders,
    selectedOrder,
    setSelectedOrder,
    isModalOpen,
    setModalOpen,
    updateOrderStatus,
    updateRiderLocation,
    getOrdersByStatus,
    addOrder
  } = useOrderStore();

  // Filter products for search
  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Add function to manually refresh orders
  const refreshOrders = async () => {
    if (!userData?._id) return;
    
    try {
      console.log('Manually refreshing orders...');
      const response = await axiosInstance.get(`/api/v1/order/user-orders/${userData._id}`);
      if (response.data.data.orders) {
        console.log('Orders refreshed:', response.data.data.orders);
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      const handleOrderUpdate = (update: any) => {
        console.log("Received order update for selected order:", update);
        
        // Only handle status updates for the currently selected order
        const type = update.type || '';
        
        // Handle status updates without showing duplicate notifications
        if (type === "ORDER_ACCEPTED") {
          console.log(`Updating order ${selectedOrder._id} status to accepted`);
          updateOrderStatus(selectedOrder._id, "accepted");
          // Force a refresh to ensure UI is updated
          refreshOrders();
        } else if (type === "ORDER_REJECTED") {
          updateOrderStatus(selectedOrder._id, "rejected");
        } else if (type === "PICKUP") {
          updateOrderStatus(selectedOrder._id, "pickup");
        } else if (type === "DELIVERED") {
          updateOrderStatus(selectedOrder._id, "delivered");
        }

        if (update.rider?.location) {
          updateRiderLocation(selectedOrder._id, {
            coordinates: [update.rider.location.lat, update.rider.location.lng]
          });
        }
      };

      socketService.subscribeToOrderUpdates(selectedOrder._id, handleOrderUpdate);

      return () => {
        socketService.unsubscribeFromOrderUpdates(selectedOrder._id);
      };
    }
  }, [selectedOrder, updateOrderStatus, updateRiderLocation]);

  useEffect(() => {
    if (!userData?._id) {
      toast.error('Please login to view your orders');
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log(`Fetching orders for user ${userData._id}...`);
        const response = await axiosInstance.get(`/api/v1/order/user-orders/${userData._id}`);
        console.log('Orders response:', response.data.data.orders);
        setOrders(response.data.data.orders);
        // Only show toast on error to reduce notification frequency
      } catch (error) {
        toast.error('Error fetching orders');
        console.error('Error fetching orders:', error);
      }
    };

    if (orders.length === 0) { // Fetch only if orders are empty
      fetchOrders();
    }

    // Initialize socket connection
    console.log('Initializing socket with userId:', userData._id);
    socketService.initialize(userData._id);

    // Only listen for critical order updates
    socketService.subscribeToOrderUpdates('newOrder', (update: any) => {
      if (update.orderId) {
        // Fetch the new order details from the backend
        const fetchNewOrder = async () => {
          try {
            const response = await axiosInstance.get(`/api/v1/order/${update.orderId}`);
            if (response.data.success) {
              addOrder(response.data.data.order);
              // Show notification for new orders only
              toast.info('New order has been added');
            }
          } catch (error) {
            console.error('Error fetching new order:', error);
          }
        };
        fetchNewOrder();
      }
    });

    // Subscribe to general order updates - but with minimal notifications
    socketService.subscribeToOrderUpdates('orderUpdate', (update: any) => {
      console.log("Received general order update:", update);
      if (update.orderId && update.type) {
        // Update order status without showing toast unless it's a critical update
        if (update.type === "ORDER_ACCEPTED") {
          console.log(`Updating order ${update.orderId} status to accepted (from global listener)`);
          updateOrderStatus(update.orderId, "accepted");
          // Force a refresh to ensure the UI is updated
          refreshOrders();
          // Only show toast for important status changes
          toast.success("Your order has been accepted by the store!");
        } else if (update.type === "ORDER_REJECTED") {
          updateOrderStatus(update.orderId, "rejected");
          toast.error("Your order has been rejected by the store");
          refreshOrders();
        } else if (update.type === "DELIVERED") {
          updateOrderStatus(update.orderId, "delivered");
          toast.success("Your order has been delivered!");
          refreshOrders();
        } else {
          // Update silently for less critical updates
          if (update.type === "PICKUP") {
            updateOrderStatus(update.orderId, "pickup");
            refreshOrders();
          }
        }
      }
    });

    // Set up a polling refresh every 30 seconds to ensure order status is up-to-date
    const refreshInterval = setInterval(() => {
      refreshOrders();
    }, 30000);

    return () => {
      socketService.disconnect();
      clearInterval(refreshInterval);
    };
  }, [userData, navigate, setOrders, addOrder, updateOrderStatus]);

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
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleOrderClick(order)}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <span className={getStatusBadgeClass(order.orderStatus)}>
            {getStatusLabel(order.orderStatus)}
          </span>
          <p className="text-sm text-gray-500 mt-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="font-bold">₹{order.totalPrice}</p>
      </div>
      <div className="space-y-3">
        {order.items.map((item, idx) => {
          const productDetails = getProductDetails(item.product);
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-5">{title}</h2>
        <div className="space-y-5">
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
    <div className="container mx-auto px-5 py-6">
      <Helmet>
        <title>Suvega | Order History</title>
        <meta name="description" content="View your order history on Suvega." />
        <link rel="canonical" href="https://suveganow.com/order-history" />
        
      </Helmet>
      <div className="fixed top-0 left-0 right-0 bg-white p-5 z-10 sm:hidden shadow-sm">
        <div className="flex items-center h-14 mb-3">
          <button 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          {/* Location Info */}
          <div className="flex-1">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium">Delivery in 15 minutes</h1>
              <p className="text-xs text-gray-500 mt-1">
                {formatAddress()}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar - Only visible on mobile */}
        <SearchBar
          className="w-full"
          isMobile={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          filteredProducts={filteredProducts}
          onProductClick={handleProductClick}
        />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold mb-8 mt-4">My Orders</h1>
        <button 
          onClick={refreshOrders} 
          className="bg-primary text-white px-4 py-2 rounded-md text-sm flex items-center mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="space-y-10">
        <OrderSection title="Pending Orders" orders={getOrdersByStatus('pending').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        <OrderSection title="Accepted Orders" orders={getOrdersByStatus('accepted').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        <OrderSection title="Orders Out for Delivery" orders={getOrdersByStatus('pickup').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        <OrderSection title="Delivered Orders" orders={getOrdersByStatus('delivered').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        <OrderSection title="Cancelled Orders" orders={getOrdersByStatus('cancelled').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        <OrderSection title="Rejected Orders" orders={getOrdersByStatus('rejected').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
      </div>

      {selectedOrder && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-7 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-6">Order Details</h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="font-medium">{selectedOrder._id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={getStatusBadgeClass(selectedOrder.orderStatus)}>
                  {getStatusLabel(selectedOrder.orderStatus)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-3 mt-2">
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
                <p className="text-sm text-gray-500 mb-2">Payment Details</p>
                <div className="mt-2 space-y-1">
                  <p>Method: {selectedOrder.paymentMethod.toUpperCase()}</p>
                  <p>Status: {selectedOrder.paymentStatus}</p>
                  <p className="font-bold mt-2">Total: ₹{selectedOrder.totalPrice}</p>
                </div>
              </div>

              {selectedOrder.deliveryRider && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Delivery Partner</p>
                  <div className="mt-2 space-y-3">
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