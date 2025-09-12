import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { ref, update } from "firebase/database";
import { TextsContext } from "~/root";
import InputTextarea from "~/components/atoms/InputTextarea";
import type { Text } from "~/types";

interface TextsProps {
  form: Text;
}

export default component$((props: TextsProps) => {
  const store = useStore<TextsProps>({
    form: props.form,
  });
  const textStore = useContext(TextsContext);

  const closeOpened = $(() => {
    textStore.openedId = undefined;
  });

  const mod = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const texts = ref(db, `texts/${store.form.id}`);
    const result = await update(texts, store.form);

    closeOpened();

    return result;
  });

  return (
    <form method="post" preventdefault:submit onSubmit$={mod}>
      <div class="row grid-cols-1">
        <InputTextarea
          class="min-h-[30vh]"
          name="content"
          label="Text description"
          value={store.form.text}
          required={true}
          on-input={$((ev: any) => (store.form.text = ev.target.value))}
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
