import {
  component$,
  useStore,
  useVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/utils/firebase";
import { ref, onValue } from "firebase/database";
import type { Customer } from "~/types";
import { SITE } from "~/config.mjs";
import Title from "~/components/atoms/Title";
import Row from "~/components/customers/Row";
import Spinner from "~/components/atoms/Spinner";
import AddForm from "~/components/customers/AddForm";
import { UserInformationContext } from "~/root";

interface CustomersProps {
  customers?: Customer[];
}

export default component$(() => {
  const store = useStore<CustomersProps>(
    {
      customers: undefined,
    },
    { deep: true }
  );

  const currentUser = useContext(UserInformationContext);

  useVisibleTask$(async () => {
    const db = await getDb();
    const customers = ref(db, "customers");

    onValue(customers, (snapshot) => {
      const res = snapshot.val();
      store.customers = res
        ? Object.keys(res)?.map((key: string) => {
            return { ...res[key], id: key } as Customer;
          })
        : [];
    });
  });

  return (
    <section>
      <header>
        <Title>Customers</Title>
      </header>

      {currentUser.isLogged && <AddForm />}

      {store.customers && store.customers.length ? (
        <div class="list">
          {store.customers.map((item: Customer) => (
            <Row key={item.id} item={item} />
          ))}
        </div>
      ) : store.customers ? (
        <div class="notification is-danger">There aren't customers</div>
      ) : (
        <Spinner />
      )}
    </section>
  );
});

export const head: DocumentHead = {
  title: `Customers — ${SITE.name}`,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
