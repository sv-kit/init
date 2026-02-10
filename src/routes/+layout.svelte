<script lang="ts">
  import { ModeWatcher } from "mode-watcher";

  import { Toaster } from "~components/ui/sonner";
  import { TooltipProvider } from "~components/ui/tooltip";

  import "./layout.css";

  let { children } = $props();
</script>

<ModeWatcher />

<Toaster />

<TooltipProvider>
  {@render children()}
</TooltipProvider>
