import type { Customer } from "~/types";
import { getDb } from "~/utils/firebase";
import { ref, get, onValue } from "firebase/database";

const load = async () => {
  const db = await getDb();
  const customers = ref(db, "customers");
  const res = (await get(customers)).val() as any;
  _customers = res
    ? Object.keys(res)?.map((key: string) => {
        return { ...res[key], id: key } as Customer;
      })
    : [];

  onValue(customers, (snapshot) => {
    const res = snapshot.val();
    _customers = res
      ? Object.keys(res)?.map((key: string) => {
          return { ...res[key], id: key } as Customer;
        })
      : [];
  });

  return _customers;
};

let _customers: Customer[];

export const fetchCustomers = async (): Promise<Customer[]> => {
  _customers = _customers || load();

  return await _customers;
};

export const findCustomerBySlug = async (
  slug: string
): Promise<Customer | null> => {
  if (!slug) return null;

  return _customers?.find((item) => item.slug === slug) as Customer;
};
