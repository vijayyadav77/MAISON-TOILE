export const BRAND_NAME = 'MAISON ÉTOILE';
export const BRAND_TAGLINE = 'Haute Couture & Runway Collections';
export const FREE_SHIPPING_THRESHOLD = 15000;
export const STANDARD_SHIPPING_FEE = 500;
export const TAX_RATE = 0.12;

export const ORDER_STATUS_LABELS = {
  processing: { label: 'Order Placed', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-900 border-blue-200' },
  shipped: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-900 border-indigo-200' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-900 border-rose-200' },
};

export const PAYMENT_STATUS_LABELS = {
  pending: { label: 'Awaiting Payment', color: 'bg-amber-50 text-amber-800' },
  paid: { label: 'Payment Verified', color: 'bg-emerald-50 text-emerald-800' },
  failed: { label: 'Payment Failed', color: 'bg-rose-50 text-rose-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};
