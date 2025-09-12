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
import type { Project } from "~/types";
import { UserInformationContext, ProjectsContext } from "~/root";
import Confirm from "../atoms/Confirm";
import UpdateForm from "./UpdateForm";

interface ProjectsRowProps {
  item: Project;
}

export default component$((props: ProjectsRowProps) => {
  const store = useStore<ProjectsRowProps>({
    item: props.item as Project,
  });
  const currentUser = useContext(UserInformationContext);
  const projectStore = useContext(ProjectsContext);
  const showSureDel = useSignal(false);

  const del = $(async () => {
    const db = await getDb();
    const projects = ref(db, `/projects/${store.item.id}`);
    return remove(projects);
  });

  const toggleSureDel = $(() => {
    showSureDel.value = !showSureDel.value;
  });

  const setShowUpdate = $(() => {
    projectStore.openedId = store.item.id;
  });

  return (
    <div class="card" key={store.item.id}>
      {projectStore.openedId === store.item.id && currentUser.isLogged ? (
        <UpdateForm form={store.item} />
      ) : (
        <>
          <h2>
            <a href={`/projects/${store.item.slug}`}>{store.item.name}</a>
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
                Sei sicuro di voler eliminare questo progetto?
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
