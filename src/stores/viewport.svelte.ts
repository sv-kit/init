import { browser } from "$app/environment";

export function useViewport() {
  let width = $state<number>(browser ? window.innerWidth : 0);

  const isXs = $derived(width < 640);
  const isSm = $derived(width >= 640 && width < 768);
  const isMd = $derived(width >= 768 && width < 1024);
  const isLg = $derived(width >= 1024 && width < 1280);
  const isXl = $derived(width >= 1280);

  const smUp = $derived(width >= 640);
  const mdUp = $derived(width >= 768);
  const lgUp = $derived(width >= 1024);
  const xlUp = $derived(width >= 1280);

  function update() {
    width = window.innerWidth;
  }

  if (browser) {
    window.addEventListener("resize", update);
  }

  $effect(() => {
    return () => {
      if (browser) window.removeEventListener("resize", update);
    };
  });

  return {
    get width() {
      return width;
    },

    get isXs() {
      return isXs;
    },
    get isSm() {
      return isSm;
    },
    get isMd() {
      return isMd;
    },
    get isLg() {
      return isLg;
    },
    get isXl() {
      return isXl;
    },

    get smUp() {
      return smUp;
    },
    get mdUp() {
      return mdUp;
    },
    get lgUp() {
      return lgUp;
    },
    get xlUp() {
      return xlUp;
    }
  };
}
