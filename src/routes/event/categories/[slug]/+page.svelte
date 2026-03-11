<script>
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import EventCard from "$lib/components/EventCard.svelte";
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { apiUrl, imageUrl } from "$lib/utils/api_url";
    import { ArrowRight, SearchX } from "lucide-svelte";
    import Shimmer from "$lib/components/shimmer.svelte";

    const slug = $page.params.slug;

    /** @type {Array} */
    let events = [];
    /** @type {object|null} */
    let category = null;
    let loading = true;
    let error = "";

    async function loadData() {
        loading = true;
        error = "";
        try {
            const [eventsRes, catsRes] = await Promise.all([
                fetch(`${apiUrl}/events/category/${slug}`),
                fetch(`${apiUrl}/categories`),
            ]);

            const eventsJson = await eventsRes.json();
            const catsJson   = await catsRes.json();

            if (eventsJson.status) events   = eventsJson.data ?? [];
            if (catsJson.status)   category = (catsJson.data ?? []).find((c) => c.slug === slug) ?? null;
        } catch (e) {
            error = e.message ?? "Une erreur est survenue";
        } finally {
            loading = false;
        }
    }

    loadData();

    $: name = category?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1));
    $: iconSrc = category?.icon
        ? category.icon.startsWith("http") ? category.icon : `${imageUrl}/${category.icon}`
        : null;
    $: count = events.length;
</script>

<Navbar />

<div class="min-h-screen bg-base-100 pt-[68px]">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="relative bg-base-200 border-b border-primary/10 py-12 px-4 overflow-hidden">
        <!-- Blob décoratif -->
        <div class="absolute -top-12 -right-12 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Image catégorie en fond si disponible -->
        {#if iconSrc}
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={iconSrc} alt="" class="w-full h-full object-cover opacity-[0.06]" />
                <div class="absolute inset-0 bg-linear-to-r from-base-200 via-base-200/80 to-base-200/40"></div>
            </div>
        {/if}

        <div class="relative max-w-7xl mx-auto">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-base-content/30 mb-5 font-semibold">
                <a href="/" class="hover:text-primary transition-colors duration-200">Accueil</a>
                <span class="text-base-content/15">/</span>
                <a href="/event/categories" class="hover:text-primary transition-colors duration-200">Catégories</a>
                <span class="text-base-content/15">/</span>
                <span class="text-primary">{name}</span>
            </div>

            <div class="flex items-end gap-5">
                <!-- Icône catégorie si dispo -->
                {#if iconSrc}
                    <div class="w-16 h-16 rounded-2xl border border-primary/20 overflow-hidden shrink-0 hidden sm:block">
                        <img src={iconSrc} alt={name} class="w-full h-full object-cover" />
                    </div>
                {/if}

                <div>
                    <h1 class="font-bold text-base-content leading-tight" style="font-size: clamp(2rem, 4vw, 3rem)">
                        <span class="italic font-light text-primary">{name}</span>
                    </h1>
                    {#if !loading}
                        <p class="text-sm text-base-content/40 mt-1.5 font-medium">
                            <span class="text-primary font-bold">{count}</span>
                            événement{count !== 1 ? "s" : ""} disponible{count !== 1 ? "s" : ""}
                        </p>
                    {:else}
                        <div class="skeleton h-4 w-40 rounded mt-2"></div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- ── Contenu ─────────────────────────────────────────────────────────── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <!-- Loading skeletons -->
        {#if loading}
            <Shimmer />
        <!-- Erreur -->
        {:else if error}
            <div class="flex flex-col items-center gap-4 py-24 text-center">
                <p class="text-base-content/35 text-sm">{error}</p>
                <button type="button" on:click={loadData} class="btn btn-primary btn-sm rounded-full">
                    Réessayer
                </button>
            </div>

        <!-- Vide -->
        {:else if events.length === 0}
            <div class="flex flex-col items-center gap-4 py-24 text-center">
                <div class="w-16 h-16 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center">
                    <SearchX size={28} class="text-base-content/20" />
                </div>
                <div>
                    <h3 class="font-bold text-lg text-base-content/30 mb-1">
                        Aucun événement pour cette catégorie
                    </h3>
                    <p class="text-sm text-base-content/25">
                        Revenez bientôt, de nouveaux événements arrivent régulièrement.
                    </p>
                </div>
                <a href="/event/categories" class="btn btn-primary btn-sm rounded-full gap-2 mt-2 text-xs uppercase tracking-wider">
                    Voir toutes les catégories
                    <ArrowRight size={13} />
                </a>
            </div>

        <!-- Grille événements -->
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {#each events as event, i (event.id)}
                    <div in:fly={{ y: 16, duration: 350, delay: i * 50 }}>
                        <EventCard {event} />
                    </div>
                {/each}
            </div>
        {/if}

    </div>
</div>

<Footer />