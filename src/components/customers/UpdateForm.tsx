import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { ref, update } from "firebase/database";
import { getDb } from "~/utils/firebase";
import { CustomersContext } from "~/root";
import InputText from "~/components/atoms/InputText";
import InputTextarea from "~/components/atoms/InputTextarea";
import type { Customer } from "~/types";

interface CustomersProps {
  form: Customer;
}

export default component$((props: CustomersProps) => {
  const store = useStore<CustomersProps>({
    form: props.form,
  });
  const customerStore = useContext(CustomersContext);

  const closeOpened = $(() => {
    customerStore.openedId = undefined;
  });

  const mod = $(async () => {
    const db = await getDb();
    const customers = ref(db, `customers/${store.form.id}`);
    const result = await update(customers, store.form);

    closeOpened();

    return result;
  });

  return (
    <form method="post" preventdefault:submit onSubmit$={mod}>
      <div class="row grid-cols-2">
        <InputText
          name="name"
          label="Customer name"
          value={store.form.name}
          required={true}
          on-input={$((ev: any) => (store.form.name = ev.target.value))}
        />
        <InputText
          name="slug"
          label="Customer slug"
          value={store.form.slug}
          required={true}
          on-input={$((ev: any) => (store.form.slug = ev.target.value))}
        />
      </div>
      <div class="row grid-cols-1">
        <InputText
          name="url"
          label="URL"
          value={store.form.url}
          required={true}
          on-input={$((ev: any) => (store.form.url = ev.target.value))}
        />
      </div>
      <div class="row grid-cols-1">
        <InputTextarea
          class="min-h-[30vh]"
          name="content"
          label="Short description"
          value={store.form.content}
          required={true}
          on-input={$((ev: any) => (store.form.content = ev.target.value))}
        />
      </div>
      <div class="row grid-cols-1">
        <InputTextarea
          class="min-h-[50vh]"
          name="description"
          label="Long description"
          value={store.form.description}
          required={true}
          on-input={$((ev: any) => (store.form.description = ev.target.value))}
        />
      </div>
      <div class="actions">
        <button type="button" class="btn btn-secondary" onClick$={closeOpened}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
});
