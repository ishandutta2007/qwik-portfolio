import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { ref, update } from "firebase/database";
import { db } from "~/utils/firebase";
import { NewsContext } from "~/root";
import InputText from "~/components/atoms/InputText";
import InputTextarea from "~/components/atoms/InputTextarea";
import type { New } from "~/types";

interface NewsProps {
  form: New;
}

export default component$((props: NewsProps) => {
  const store = useStore<NewsProps>({
    form: props.form,
  });
  const newStore = useContext(NewsContext);

  const closeOpened = $(() => {
    newStore.openedId = undefined;
  });

  const mod = $(async () => {
    const news = ref(db, `news/${store.form.id}`);
    const result = await update(news, store.form);

    closeOpened();

    return result;
  });

  return (
    <form method="post" preventdefault:submit onSubmit$={mod}>
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
