<script lang="ts">
  import { page } from "$app/state";
  import { PUBLIC_URL } from "$env/static/public";

  interface Props {
    title: string;
    url?: string;
    siteName?: string;
    description?: string;
    keywords?: string;
    image?: string;
    twitterHandle?: string;
    type?: "website" | "article";
    locale?: string;
  }

  const TITLE = "";
  const DEFAULT_TITLE = "";

  const {
    title,
    url,
    siteName = TITLE,
    description = "",
    keywords = "",
    image = `${PUBLIC_URL}/og-image.webp`,
    twitterHandle = "@",
    type = "website",
    locale = "en_US"
  }: Props = $props();

  const normalizedTitle = $derived(title === "default" ? DEFAULT_TITLE : `${title} | ${TITLE}`);

  const normalizedUrl = $derived(
    url
      ? url.startsWith("http")
        ? url
        : `${PUBLIC_URL.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`
      : page.url.href
  );
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{normalizedTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={normalizedUrl} />

  <meta property="og:type" content={type} />
  <meta property="og:title" content={normalizedTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={normalizedUrl} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content={locale} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={normalizedTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:site" content={twitterHandle} />
  <meta name="twitter:creator" content={twitterHandle} />
  <meta name="twitter:url" content={normalizedUrl} />
</svelte:head>
