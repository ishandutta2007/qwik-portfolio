import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { ref, update } from "firebase/database";
import { SkillsContext } from "~/root";
import InputText from "~/components/atoms/InputText";
import InputRange from "~/components/atoms/InputRange";
import type { Skill } from "~/types";

interface SkillsProps {
  form: Skill;
}

export default component$((props: SkillsProps) => {
  const store = useStore<SkillsProps>({
    form: props.form,
  });
  const skillStore = useContext(SkillsContext);

  const closeOpened = $(() => {
    skillStore.openedId = undefined;
  });

  const mod = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const skills = ref(db, `skills/${store.form.id}`);
    const result = await update(skills, store.form);

    closeOpened();

    return result;
  });

  return (
    <form method="post" preventdefault:submit onSubmit$={mod}>
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
