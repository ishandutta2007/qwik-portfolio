import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { getAuthInstance } from "~/utils/firebase";
import InputText from "~/components/atoms/InputText";
import {
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { UserInformationContext } from "~/root";

interface Credentials {
  form: {
    email: string;
    password: string;
  };
}

export default component$(() => {
  const store = useStore<Credentials>({
    form: {
      email: "",
      password: "",
    },
  });

  const currentUser = useContext(UserInformationContext);

  const login = $(async () => {
    const auth = await getAuthInstance();
    auth.setPersistence(browserSessionPersistence);
    signInWithEmailAndPassword(auth, store.form.email, store.form.password);
  });

  return (
    <>
      {currentUser.isLogged === false && (
        <form
          class="login"
          method="post"
          preventdefault:submit
          onSubmit$={login}
        >
          <div class="row">
            <InputText
              name="email"
              label="E-Mail"
              placeholder="E-Mail"
              value={store.form.email}
              required={true}
              on-input={$((ev: any) => (store.form.email = ev.target.value))}
            />
            <InputText
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              value={store.form.password}
              required={true}
              on-input={$((ev: any) => (store.form.password = ev.target.value))}
            />
          </div>
          <div class="actions">
            <button type="submit" class="btn btn-primary w-full">
              Login
            </button>
          </div>
        </form>
      )}
    </>
  );
});
