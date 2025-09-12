import { component$ } from "@builder.io/qwik";

export default component$(() => (
  <span class="self-center ml-2 text-2xl md:text-xl font-bold text-gray-900 whitespace-nowrap dark:text-white flex items-center">
    <picture>
      <source srcset="/images/icon.svg" type="image/svg" />
      <img
        class="inline-block mr-1"
        width="64"
        height="64"
        alt="miciodev Logo"
        srcset="/images/icon.svg"
      />
      @miciodev
    </picture>
  </span>
));
