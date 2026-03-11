<script>
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import { Toaster } from "svelte-sonner";
	import PageLoader from "$lib/components/PageLoader.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" richColors theme="dark" />

<PageLoader />

{@render children()}
