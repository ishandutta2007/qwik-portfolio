import {
  component$,
  useStore,
  $,
  useSignal,
  useContext,
} from "@builder.io/qwik";
import { ref, remove } from "firebase/database";
import md from "markdown-it";
import type { New } from "~/types";
import { UserInformationContext, NewsContext } from "~/root";
import Confirm from "../atoms/Confirm";
import UpdateForm from "./UpdateForm";

interface NewsRowProps {
  item: New;
}

export default component$((props: NewsRowProps) => {
  const store = useStore<NewsRowProps>({
    item: props.item as New,
  });
  const currentUser = useContext(UserInformationContext);
  const newStore = useContext(NewsContext);
  const showSureDel = useSignal(false);

  const del = $(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const news = ref(db, `/news/${store.item.id}`);
    return remove(news);
  });

  const toggleSureDel = $(() => {
    showSureDel.value = !showSureDel.value;
  });

  const setShowUpdate = $(() => {
    newStore.openedId = store.item.id;
  });

  return (
    <div class="card" key={store.item.id}>
      {newStore.openedId === store.item.id && currentUser.isLogged ? (
        <UpdateForm form={store.item} />
      ) : (
        <>
          <h2>
            <a href={`/news/${store.item.slug}`}>{store.item.title}</a>
          </h2>
          <p class="content py-1">
            <a
              href={`/news/${store.item.slug}`}
              dangerouslySetInnerHTML={
                store.item.content &&
                md({
                  html: true,
                }).render(store.item.content)
              }
            />
          </p>
          <p class="content py-1">
            {new Date(store.item.date).toLocaleDateString("it-IT")}
          </p>
          <div class="actions text-center">
            {showSureDel.value ? (
              <Confirm
                confirm={del}
                cancel={$(() => (showSureDel.value = false))}
              >
                Are you sure you want to delete this news?
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
