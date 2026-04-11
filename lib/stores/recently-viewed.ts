import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
};

type RecentlyViewedState = {
  items: RecentProduct[];
  addViewed: (product: RecentProduct) => void;
};

const MAX_ITEMS = 12;

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addViewed: (product) =>
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        }),
    }),
    { name: "al-recently-viewed" }
  )
);
