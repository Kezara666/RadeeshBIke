/** Sri Lankan Rupee, e.g. "LKR 3,150". Digits stay Latin in both languages. */
export const formatLKR = (amount: number) =>
  `LKR ${Math.round(amount).toLocaleString("en-US")}`;
