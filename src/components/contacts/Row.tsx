import {
  component$,
  useStore,
  $,
  useSignal,
  useContext,
} from "@builder.io/qwik";
import { ref, remove } from "firebase/database";
import type { Contact } from "~/types";
import { UserInformationContext } from "~/root";
import Confirm from "../atoms/Confirm";

interface ContactsRowProps {
  item: Contact;
}

export default component$((props: ContactsRowProps) => {
  const store = useStore<ContactsRowProps>({
    item: props.item as Contact,
  });
  const currentUser = useContext(UserInformationContext);
  const showSureDel = useSignal(false);

  const del = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const contacts = ref(db, `/contacts/${store.item.id}`);
    return remove(contacts);
  });

  const toggleSureDel = $(() => {
    showSureDel.value = !showSureDel.value;
  });

  return (
    <div class="card" key={store.item.id}>
      <h2>{store.item.email}</h2>
      <p class="content py-1">{store.item.text}</p>
      <div class="actions text-center">
        {showSureDel.value ? (
          <Confirm confirm={del} cancel={$(() => (showSureDel.value = false))}>
            Are you sure wants to delete this message?
          </Confirm>
        ) : (
          currentUser.isLogged && (
            <>
              <button class="btn btn-delete btn-small" onClick$={toggleSureDel}>
                Delete
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
});
