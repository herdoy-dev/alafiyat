import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
};

type WishlistState = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  count: () => number;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        }),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      has: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    { name: "al-wishlist" }
  )
);
