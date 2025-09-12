import {
  component$,
  useStore,
  useVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { ref, onValue } from "firebase/database";
import type { Project } from "~/types";
import { SITE } from "~/config.mjs";
import Title from "~/components/atoms/Title";
import Row from "~/components/projects/Row";
import Spinner from "~/components/atoms/Spinner";
import AddForm from "~/components/projects/AddForm";
import { UserInformationContext } from "~/root";

interface ProjectsProps {
  projects?: Project[];
}

export default component$(() => {
  const store = useStore<ProjectsProps>(
    {
      projects: undefined,
    },
    { deep: true }
  );

  const currentUser = useContext(UserInformationContext);

  useVisibleTask$(async () => {
    const { getDb } = await import("~/utils/firebase.client");
    const db = await getDb();
    const projects = ref(db, "projects");

    onValue(projects, (snapshot) => {
      const res = snapshot.val();
      store.projects = res
        ? Object.keys(res)?.map((key: string) => {
            return { ...res[key], id: key } as Project;
          })
        : [];
    });
  });

  return (
    <section>
      <header>
        <Title>Projects</Title>
      </header>

      {currentUser.isLogged && <AddForm />}

      {store.projects && store.projects.length ? (
        <div class="list">
          {store.projects.map((item: Project) => (
            <Row key={item.id} item={item} />
          ))}
        </div>
      ) : store.projects ? (
        <div class="notification is-danger">There aren't projects</div>
      ) : (
        <Spinner />
      )}
    </section>
  );
});

export const head: DocumentHead = {
  title: `Projects — ${SITE.name}`,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
