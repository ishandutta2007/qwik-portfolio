import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { ref, push } from "firebase/database";
import { getDb } from "~/utils/firebase";
import InputText from "~/components/atoms/InputText";
import InputTextarea from "~/components/atoms/InputTextarea";
import { UserInformationContext } from "~/root";

interface Contact {
  form: {
    email: string;
    text: string;
  };
}

export default component$(() => {
  const store = useStore<Contact>({
    form: {
      email: "",
      text: "",
    },
  });

  const currentUser = useContext(UserInformationContext);

  const send = $(async () => {
    const db = await getDb();
    const contacts = ref(db, "contacts");
    const result = await push(contacts, store.form);

    if (result.key) {
      store.form = { email: "", text: "" };
    }

    return result;
  });

  return (
    <>
      {currentUser.isLogged === false && (
        <form
          class="contact"
          method="post"
          preventdefault:submit
          onSubmit$={send}
        >
          <div class="row">
            <InputText
              name="email"
              type="email"
              label="E-Mail"
              placeholder="Your E-Mail"
              value={store.form.email}
              required={true}
              on-input={$((ev: any) => (store.form.email = ev.target.value))}
            />
            <InputTextarea
              name="slug"
              label="Text"
              placeholder="Write your message here"
              value={store.form.text}
              class="min-h-[40vh]"
              required={true}
              on-input={$((ev: any) => (store.form.text = ev.target.value))}
            />
          </div>
          <div class="actions">
            <button type="submit" class="btn btn-primary w-full">
              Send
            </button>
          </div>
        </form>
      )}
    </>
  );
});
