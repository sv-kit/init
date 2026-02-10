<script lang="ts">
  import { goto } from "$app/navigation";

  import { Button } from "./ui/button";

  interface Props {
    message: string;
  }

  const { message }: Props = $props();
</script>

<div class="relative min-h-screen">
  <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
    <div class="mb-6">
      <h1 class="text-destructive text-xl font-semibold">Something went wrong</h1>
      <p class="text-destructive mt-2 max-w-lg text-sm">{message}</p>
    </div>

    <Button onclick={() => goto("/")}>Go to Home</Button>
  </div>
</div>
