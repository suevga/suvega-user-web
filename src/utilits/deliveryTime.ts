export const formatDeliveryTime = (deliveryTime?: string): string => {
  if (!deliveryTime) return '15 minutes';
  
  const time = deliveryTime.toLowerCase().trim();
  
  if (time === '15' || time === '30') {
    return `${time} minutes`;
  }
  
  if (time === '1hour') {
    return '1 hour';
  }
  
  if (time === '1day') {
    return '1 day';
  }
  
  return '15 minutes';
};
