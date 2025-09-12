import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import { ref, push } from "firebase/database";
import InputText from "~/components/atoms/InputText";
import InputTextarea from "~/components/atoms/InputTextarea";
import type { New } from "~/types";

interface NewsProps {
  form: New;
}

export default component$(() => {
  const store = useStore<NewsProps>({
    form: {} as New,
  });

  const opened = useSignal(false);

  const toggleOpened = $(() => {
    opened.value = !opened.value;
  });

  const create = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const news = ref(db, "news");
    const result = await push(news, store.form);

    if (result.key) {
      store.form = {} as New;

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
              name="title"
              label="Title"
              value={store.form.title}
              required={true}
              on-input={$((ev: any) => (store.form.title = ev.target.value))}
            />
            <InputText
              name="slug"
              label="Slug"
              value={store.form.slug}
              required={true}
              on-input={$((ev: any) => (store.form.slug = ev.target.value))}
            />
          </div>
          <div class="row grid-cols-1">
            <InputText
              name="date"
              type="date"
              label="Date"
              value={store.form.date}
              required={true}
              on-input={$((ev: any) => (store.form.date = ev.target.value))}
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
          Add new
        </button>
      )}
    </div>
  );
});
