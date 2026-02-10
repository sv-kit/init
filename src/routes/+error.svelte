<script lang="ts">
  import { page } from "$app/state";

  import ErrorComponent from "~components/error-component.svelte";
</script>

<ErrorComponent message={page.error ? page.error.message : "Something went wrong"} />
