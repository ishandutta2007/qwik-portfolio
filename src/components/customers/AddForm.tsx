import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import { ref, push } from "firebase/database";
import { getDb } from "~/utils/firebase";
import InputText from "~/components/atoms/InputText";
import InputTextarea from "~/components/atoms/InputTextarea";
import type { Customer } from "~/types";

interface CustomersProps {
  form: Customer;
}

export default component$(() => {
  const store = useStore<CustomersProps>({
    form: {} as Customer,
  });

  const opened = useSignal(false);

  const toggleOpened = $(() => {
    opened.value = !opened.value;
  });

  const create = $(async () => {
    const db = await getDb();
    const customers = ref(db, "customers");
    const result = await push(customers, store.form);

    if (result.key) {
      store.form = {} as Customer;

      toggleOpened();
    }

    return result;
  });

  return (
    <div class="py-4 my-4">
      {opened.value ? (
        <form method="post" preventdefault:submit onSubmit$={create}>
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
              on-input={$(
                (ev: any) => (store.form.description = ev.target.value)
              )}
            />
          </div>
          <div class="actions">
            <button
              type="button"
              class="btn btn-secondary"
              onClick$={toggleOpened}
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Create
            </button>
          </div>
        </form>
      ) : (
        <button type="button" class="btn btn-primary" onClick$={toggleOpened}>
          Add customer
        </button>
      )}
    </div>
  );
});
