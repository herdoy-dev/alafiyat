"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
} | null;

type CustomerAuthContextType = {
  customer: Customer;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  customer: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/me");
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer || null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    setCustomer(null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, refresh, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
