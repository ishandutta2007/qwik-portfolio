import {
  component$,
  useStore,
  useSignal,
  useVisibleTask$,
  useContext,
  $,
} from "@builder.io/qwik";
import type { Text } from "~/types";
import { getDb } from "~/utils/firebase";
import { ref, onValue } from "firebase/database";
import md from "markdown-it";
import { UserInformationContext, TextsContext } from "~/root";
import UpdateForm from "~/components/texts/UpdateForm";

interface TermProps {
  name?: string;
  delay: number;
  speed: number;
  text?: string;
}

interface TextRow {
  item: Text;
}

export default component$((props: TermProps) => {
  const currentUser = useContext(UserInformationContext);
  const t = useSignal("");

  const store = useStore<TextRow>({
    item: {} as Text,
  });
  const textStore = useContext(TextsContext);

  const setShowUpdate = $(() => {
    textStore.openedId = store.item.id;
  });

  useVisibleTask$(async () => {
    let interval: any = null;

    if (props.name) {
      const db = await getDb();
      const text = ref(db, `texts/${props.name}`);

      onValue(text, (snapshot) => {
        t.value = "";
        const res = snapshot.val();
        store.item = res;
        let i = 0;
        const text = res.text;

        if (interval) clearInterval(interval);

        setTimeout(() => {
          interval = setInterval(() => {
            if (i < text.length) {
              t.value += text.charAt(i);
              i++;
            } else {
              clearInterval(interval);
            }
          }, props.speed);
        }, props.delay);
      });
    } else if (props.text) {
      t.value = "";
      let i = 0;
      const text = props.text;

      if (interval) clearInterval(interval);

      setTimeout(() => {
        interval = setInterval(() => {
          if (i < text.length) {
            t.value += text.charAt(i);
            i++;
          } else {
            clearInterval(interval);
          }
        }, props.speed);
      }, props.delay);
    }
  });

  return (
    <>
      {currentUser.isLogged &&
        store.item &&
        textStore.openedId !== store.item.id && (
          <button
            class="btn btn-primary btn-small mb-1"
            onClick$={setShowUpdate}
          >
            Edit
          </button>
        )}
      {currentUser.isLogged &&
      textStore.openedId &&
      textStore.openedId === store.item.id ? (
        <UpdateForm form={store.item} />
      ) : (
        <div class="term">
          <pre
            dangerouslySetInnerHTML={
              t.value &&
              md({
                html: true,
              }).render(t.value)
            }
          />
        </div>
      )}
    </>
  );
});
