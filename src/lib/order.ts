export const FREE_SHIPPING_OVER = 3500; // LKR
export const SHIPPING_FEE = 350; // LKR

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
}

/** Cash on delivery adds a 10% handling fee on the goods subtotal. */
export const COD_FEE_RATE = 0.1;

export function codFeeFor(subtotal: number, cashOnDelivery: boolean): number {
  return cashOnDelivery ? Math.round(subtotal * COD_FEE_RATE) : 0;
}
