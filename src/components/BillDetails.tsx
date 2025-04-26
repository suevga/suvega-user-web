import useCartStore from "../store/useCartStore";

const BillDetails = () => {
  const subtotalBeforeDiscount = useCartStore(state => state.getSubtotalBeforeDiscount());
  const subtotalAfterDiscount = useCartStore(state => state.getSubtotalAfterDiscount());
  const deliveryCharge = useCartStore(state => state.getDeliveryCharge());
  const totalAmount = useCartStore(state => state.getTotalAmount());
  const totalSavings = useCartStore(state => state.getTotalSavings());
  const savingsPercentage = useCartStore(state => state.getSavingsPercentage());

  const items = useCartStore(state=> state.items);

  console.log("total price in original price::", subtotalBeforeDiscount);
  console.log("total discount price after discount::", subtotalAfterDiscount);
  console.log("total discount percentage after discount::", savingsPercentage);
  console.log("delivery charge::", deliveryCharge);
  console.log("total amount::", totalAmount);
  return items.length > 0 ? (
    <div className="space-y-4">
      <h2 className="font-extrabold text-base md:text-lg lg:text-xl underline mt-6">
        Bill Details
      </h2>
      <div className="p-3 md:p-4 bg-white rounded-lg shadow space-y-2">
        <div className="flex justify-between">
          <span className="text-xs md:text-sm font-bold text-gray-600">Total MRP:</span>
          <span className="text-xs md:text-sm">₹{subtotalBeforeDiscount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-xs md:text-sm font-bold text-gray-600">Discounted Price:</span>
          <span className="text-xs md:text-sm text-primary font-semibold">₹{subtotalAfterDiscount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-xs md:text-sm font-bold text-gray-600">You Save:</span>
          <span className="text-xs md:text-sm text-primary font-semibold">
            ₹{totalSavings} ({savingsPercentage.toFixed(1)}% OFF)
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-xs md:text-sm font-bold text-gray-600">Delivery Charge:</span>
          <span className="text-xs md:text-sm">₹{deliveryCharge}</span>
        </div>
        
        <div className="h-px bg-gray-200 my-2" />
        
        <div className="flex justify-between">
          <span className="text-base md:text-lg font-bold">Total Amount:</span>
          <span className="text-base md:text-lg font-bold text-primary">
            ₹{totalAmount}
          </span>
        </div>
      </div>
    </div>
  ) : null;
};

export default BillDetails;