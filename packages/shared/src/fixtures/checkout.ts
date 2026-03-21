export interface CheckoutForm {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const checkoutForms = {
  valid: {
    firstName: 'Jane',
    lastName: 'Doe',
    postalCode: '10001',
  } satisfies CheckoutForm,
} as const;

export interface SortOption {
  label: string;
}

export const sortOptions = {
  nameAtoZ: { label: 'Name (A to Z)' } satisfies SortOption,
  nameZtoA: { label: 'Name (Z to A)' } satisfies SortOption,
  priceLowToHigh: { label: 'Price (low to high)' } satisfies SortOption,
  priceHighToLow: { label: 'Price (high to low)' } satisfies SortOption,
} as const;
