import { component$, useStore, $, useContext } from "@builder.io/qwik";
import InputText from "~/components/atoms/InputText";
import { UserInformationContext } from "~/root";

interface Credentials {
  form: {
    email: string;
    password: string;
  };
}

export default component$(() => {
  const store = useStore<Credentials>({
    form: { email: "", password: "" },
  });

  const currentUser = useContext(UserInformationContext);

  const login = $(async () => {
    const { getAuthInstance } = await import("~/utils/firebase.client");
    const auth = await getAuthInstance();

    const {
      signInWithEmailAndPassword,
      browserSessionPersistence,
      setPersistence,
    } = await import("firebase/auth");

    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(
      auth,
      store.form.email,
      store.form.password
    );
  });

  return (
    <>
      {!currentUser.isLogged && (
        <form class="login" preventdefault:submit onSubmit$={login}>
          <div class="row">
            <InputText
              name="email"
              label="E-Mail"
              placeholder="E-Mail"
              value={store.form.email}
              required
              on-input={$((ev: any) => (store.form.email = ev.target.value))}
            />
            <InputText
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              value={store.form.password}
              required
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
