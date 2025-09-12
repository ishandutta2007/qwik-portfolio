import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import { ref, push } from "firebase/database";
import InputText from "~/components/atoms/InputText";
import InputRange from "~/components/atoms/InputRange";
import type { Skill } from "~/types";

interface SkillsProps {
  form: Skill;
}

export default component$(() => {
  const store = useStore<SkillsProps>({
    form: {} as Skill,
  });

  const opened = useSignal(false);

  const toggleOpened = $(() => {
    opened.value = !opened.value;
  });

  const create = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const skills = ref(db, "skills");
    const result = await push(skills, store.form);

    if (result.key) {
      store.form = {
        id: "",
        name: "",
        percentage: 0,
      } as Skill;

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
              label="Skill name"
              value={store.form.name}
              required={true}
              on-input={$((ev: any) => (store.form.name = ev.target.value))}
            />
            <InputRange
              name="percentage"
              label="Skill percentage"
              value={store.form.percentage}
              required={true}
              on-input={$(
                (ev: any) => (store.form.percentage = parseInt(ev.target.value))
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
          Add skill
        </button>
      )}
    </div>
  );
});
