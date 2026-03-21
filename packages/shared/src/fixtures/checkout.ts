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
  value: string;
}

export const sortOptions = {
  nameAtoZ:       { label: 'Name (A to Z)',       value: 'az'   } satisfies SortOption,
  nameZtoA:       { label: 'Name (Z to A)',       value: 'za'   } satisfies SortOption,
  priceLowToHigh: { label: 'Price (low to high)', value: 'lohi' } satisfies SortOption,
  priceHighToLow: { label: 'Price (high to low)', value: 'hilo' } satisfies SortOption,
} as const;
