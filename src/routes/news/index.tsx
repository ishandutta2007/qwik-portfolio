import {
  component$,
  useStore,
  useVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { ref, onValue } from "firebase/database";
import type { New } from "~/types";
import { SITE } from "~/config.mjs";
import Title from "~/components/atoms/Title";
import Row from "~/components/news/Row";
import Spinner from "~/components/atoms/Spinner";
import AddForm from "~/components/news/AddForm";
import { UserInformationContext } from "~/root";

interface NewsProps {
  news?: New[];
}

export default component$(() => {
  const store = useStore<NewsProps>(
    {
      news: undefined,
    },
    { deep: true }
  );

  const currentUser = useContext(UserInformationContext);

  useVisibleTask$(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const news = ref(db, "news");

    onValue(news, (snapshot) => {
      const res = snapshot.val();
      store.news = res
        ? Object.keys(res)?.map((key: string) => {
            return { ...res[key], id: key } as New;
          })
        : [];
    });
  });

  return (
    <section>
      <header>
        <Title>News</Title>
      </header>

      {currentUser.isLogged && <AddForm />}

      {store.news && store.news.length ? (
        <div class="list">
          {store.news.map((item: New) => (
            <Row key={item.id} item={item} />
          ))}
        </div>
      ) : store.news ? (
        <div class="notification is-danger">There aren't news</div>
      ) : (
        <Spinner />
      )}
    </section>
  );
});

export const head: DocumentHead = {
  title: `News — ${SITE.name}`,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
