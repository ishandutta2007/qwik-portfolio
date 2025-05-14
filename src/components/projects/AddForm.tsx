import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import { ref, push } from "firebase/database";
import { db } from "~/utils/firebase";
import InputText from "~/components/atoms/InputText";
import InputTextarea from "~/components/atoms/InputTextarea";
import type { Project } from "~/types";

interface ProjectsProps {
  form: Project;
}

export default component$(() => {
  const store = useStore<ProjectsProps>({
    form: {} as Project,
  });

  const opened = useSignal(false);

  const toggleOpened = $(() => {
    opened.value = !opened.value;
  });

  const create = $(async () => {
    const projects = ref(db, "projects");
    const result = await push(projects, store.form);

    if (result.key) {
      store.form = {} as Project;

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
              label="Project name"
              value={store.form.name}
              required={true}
              on-input={$((ev: any) => (store.form.name = ev.target.value))}
            />
            <InputText
              name="slug"
              label="Project slug"
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
                (ev: any) => (store.form.description = ev.target.value),
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
          Add project
        </button>
      )}
    </div>
  );
});
