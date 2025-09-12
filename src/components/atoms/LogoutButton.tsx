import { component$, $, useContext } from "@builder.io/qwik";
import { getAuthInstance } from "~/utils/firebase";
import { UserInformationContext } from "~/root";

export default component$(() => {
  const currentUser = useContext(UserInformationContext);

  const logout = $(async () => {
    currentUser.email = "";
    currentUser.isLogged = false;
    const auth = await getAuthInstance();
    auth.signOut();
  });

  return (
    <>
      {currentUser.isLogged && (
        <button
          type="button"
          class="btn btn-delete md:ml-4 md:static absolute bottom-4"
          onClick$={logout}
        >
          Logout
        </button>
      )}
    </>
  );
});
