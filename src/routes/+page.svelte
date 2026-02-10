<script lang="ts">
  import { error } from "@sveltejs/kit";

  import Seo from "~components/seo.svelte";

  throw error(404, "Page not found");
</script>

<Seo title="Test" />
