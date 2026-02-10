<script lang="ts">
  import type { ComponentProps } from "svelte";

  import Loader2Icon from "@lucide/svelte/icons/loader-2";

  import { cn } from "~utils/index.js";

  let { class: className, ...restProps }: ComponentProps<typeof Loader2Icon> = $props();
</script>

<Loader2Icon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
