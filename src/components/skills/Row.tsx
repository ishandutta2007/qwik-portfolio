import {
  component$,
  useStore,
  $,
  useSignal,
  useContext,
} from "@builder.io/qwik";
import { ref, remove } from "firebase/database";
import type { Skill } from "~/types";
import { UserInformationContext, SkillsContext } from "~/root";
import Confirm from "../atoms/Confirm";
import UpdateForm from "./UpdateForm";

interface SkillsRowProps {
  item: Skill;
}

export default component$((props: SkillsRowProps) => {
  const store = useStore<SkillsRowProps>({
    item: props.item as Skill,
  });
  const currentUser = useContext(UserInformationContext);
  const skillStore = useContext(SkillsContext);
  const showSureDel = useSignal(false);

  const del = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const skills = ref(db, `/skills/${store.item.id}`);
    return remove(skills);
  });

  const toggleSureDel = $(() => {
    showSureDel.value = !showSureDel.value;
  });

  const setShowUpdate = $(() => {
    skillStore.openedId = store.item.id;
  });

  return (
    <div class="py-2" key={store.item.id}>
      {skillStore.openedId === store.item.id && currentUser.isLogged ? (
        <UpdateForm form={store.item} />
      ) : (
        <>
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium dark:text-white">
              {store.item.name}
            </span>
            <span class="text-sm font-medium dark:text-white">
              {store.item.percentage}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700 mb-1">
            <div
              class="bg-primary-600 h-1 rounded-full"
              style={{ width: `${store.item.percentage}%` }}
            ></div>
          </div>
          <div class="actions text-center">
            {showSureDel.value ? (
              <Confirm
                confirm={del}
                cancel={$(() => (showSureDel.value = false))}
              >
                Sei sicuro di voler eliminare questa skill?
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
