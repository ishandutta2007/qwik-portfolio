import {
  component$,
  useStore,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/utils/firebase";
import { ref, onValue } from "firebase/database";
import type { Contact } from "~/types";
import { SITE } from "~/config.mjs";
import Title from "~/components/atoms/Title";
import Row from "~/components/contacts/Row";
import Spinner from "~/components/atoms/Spinner";
import ContactForm from "~/components/widgets/ContactForm";
import { UserInformationContext } from "~/root";

interface ContactsProps {
  contacts?: Contact[];
}

export default component$(() => {
  const store = useStore<ContactsProps>(
    {
      contacts: undefined,
    },
    { deep: true }
  );

  const currentUser = useContext(UserInformationContext);

  useVisibleTask$(async () => {
    const db = await getDb();
    const contacts = ref(db, "contacts");

    onValue(contacts, (snapshot) => {
      const res = snapshot.val();
      store.contacts = res
        ? Object.keys(res)?.map((key: string) => {
            return { ...res[key], id: key } as Contact;
          })
        : [];
    });
  });

  return (
    <section>
      <header>
        <Title>Contact</Title>
      </header>

      {currentUser.isLogged ? (
        store.contacts && store.contacts.length ? (
          <div class="list mt-4">
            {store.contacts.map((item: Contact) => (
              <Row key={item.id} item={item} />
            ))}
          </div>
        ) : store.contacts ? (
          <div class="notification is-danger">There aren't messages</div>
        ) : (
          <Spinner />
        )
      ) : (
        <ContactForm />
      )}
    </section>
  );
});

export const head: DocumentHead = {
  title: `Contact — ${SITE.name}`,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
