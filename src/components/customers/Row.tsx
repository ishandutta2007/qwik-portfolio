import {
  component$,
  useStore,
  $,
  useSignal,
  useContext,
} from "@builder.io/qwik";
import { ref, remove } from "firebase/database";
import { getDb } from "~/utils/firebase";
import md from "markdown-it";
import type { Customer } from "~/types";
import { UserInformationContext, CustomersContext } from "~/root";
import Confirm from "../atoms/Confirm";
import UpdateForm from "./UpdateForm";

interface CustomersRowProps {
  item: Customer;
}

export default component$((props: CustomersRowProps) => {
  const store = useStore<CustomersRowProps>({
    item: props.item as Customer,
  });
  const currentUser = useContext(UserInformationContext);
  const customerStore = useContext(CustomersContext);
  const showSureDel = useSignal(false);

  const del = $(async () => {
    const db = await getDb();
    const customers = ref(db, `/customers/${store.item.id}`);
    return remove(customers);
  });

  const toggleSureDel = $(() => {
    showSureDel.value = !showSureDel.value;
  });

  const setShowUpdate = $(() => {
    customerStore.openedId = store.item.id;
  });

  return (
    <div class="card" key={store.item.id}>
      {customerStore.openedId === store.item.id && currentUser.isLogged ? (
        <UpdateForm form={store.item} />
      ) : (
        <>
          <h2>
            <a href={`/customers/${store.item.slug}`}>{store.item.name}</a>
          </h2>
          <p class="content py-1">
            <p
              dangerouslySetInnerHTML={
                store.item.content &&
                md({
                  html: true,
                }).render(store.item.content)
              }
            />
          </p>
          <p class="content py-1">
            <a href={store.item.url} target="_blank">
              {store.item.url}
            </a>
          </p>
          <div class="actions text-center">
            {showSureDel.value ? (
              <Confirm
                confirm={del}
                cancel={$(() => (showSureDel.value = false))}
              >
                Are you sure wants to delete this project?
              </Confirm>
            ) : (
              currentUser.isLogged && (
                <>
                  <button
                    class="btn btn-primary btn-small"
                    onClick$={setShowUpdate}
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-delete btn-small"
                    onClick$={toggleSureDel}
                  >
                    Delete
                  </button>
                </>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
});
