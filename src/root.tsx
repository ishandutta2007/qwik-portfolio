import {
  component$,
  useStyles$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
  noSerialize,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { getAuthInstance } from "~/utils/firebase";

import { RouterHead } from "~/components/core/RouterHead";
import { DarkThemeLauncher } from "~/components/core/DarkThemeLauncher";
import { onAuthStateChanged } from "firebase/auth";

import globalStyles from "~/assets/styles/global.css?inline";

interface UserStore {
  email: string;
  isLogged?: boolean;
}

interface NewStore {
  openedId?: string;
}

interface ProjectStore {
  openedId?: string;
}

interface CustomerStore {
  openedId?: string;
}

interface SkillStore {
  openedId?: string;
}

interface TextStore {
  openedId?: string;
}

export const UserInformationContext =
  createContextId<UserStore>("user-information");

export const NewsContext = createContextId<NewStore>("news");

export const ProjectsContext = createContextId<ProjectStore>("project");

export const CustomersContext = createContextId<CustomerStore>("customer");

export const SkillsContext = createContextId<SkillStore>("skill");

export const TextsContext = createContextId<TextStore>("text");

export default component$(() => {
  useStyles$(globalStyles);

  const userStore: UserStore = useStore({
    email: "",
    isLogged: undefined,
  });
  const newStore: NewStore = useStore({
    openedId: undefined,
  });
  const projectStore: ProjectStore = useStore({
    openedId: undefined,
  });
  const customerStore: CustomerStore = useStore({
    openedId: undefined,
  });
  const skillStore: SkillStore = useStore({
    openedId: undefined,
  });
  const textStore: TextStore = useStore({
    openedId: undefined,
  });

  useContextProvider(UserInformationContext, userStore);
  useContextProvider(NewsContext, newStore);
  useContextProvider(ProjectsContext, projectStore);
  useContextProvider(CustomersContext, customerStore);
  useContextProvider(SkillsContext, skillStore);
  useContextProvider(TextsContext, textStore);

  useVisibleTask$(async () => {
    const auth = await getAuthInstance();

    onAuthStateChanged(auth, () => {
      const user = noSerialize({ ...auth.currentUser });
      if (user?.email) {
        userStore.email = user.email;
        userStore.isLogged = true;
      } else {
        userStore.isLogged = false;
      }
    });
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <DarkThemeLauncher />
      </head>
      <body
        lang="en"
        class="text-gray-900 dark:text-slate-300 tracking-tight bg-white dark:bg-gray-900 antialiased"
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
