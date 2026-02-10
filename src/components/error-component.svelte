<script lang="ts">
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

    <a href="/" class="underline">Go to Home</a>
  </div>
</div>
