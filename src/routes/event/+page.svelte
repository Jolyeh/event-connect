<script>
    import EventCard from "$lib/components/EventCard.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Shimmer from "$lib/components/shimmer.svelte";
    import { apiUrl } from "$lib/utils/api_url";
    import { Search, SlidersHorizontal, X } from "lucide-svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let search = "";
    let activeCat = "Tous";
    let activeCity = "Toutes les villes";
    let sort = "relevance";
    let filtersOpen = false;
    let categories = [];
    let events = [];
    let loading = true;

    function getLowestPrice(event) {
        if (event?.isFree) return 0;
        if (!event?.tickets || event.tickets.length === 0) return Infinity;

        const prices = event.tickets
            .map((ticket) => Number(ticket.price))
            .filter((price) => !Number.isNaN(price));

        return prices.length ? Math.min(...prices) : Infinity;
    }

    async function fetchEvents() {
        const response = await fetch(`${apiUrl}/events`, {
            credentials: "include",
            method: "GET",
        });

        const resp = await response.json();

        if (!response.ok) {
            throw new Error(
                resp.message || "Erreur lors du chargement des événements",
            );
        }

        events = Array.isArray(resp.data) ? resp.data : [];
    }

    async function fetchCategories() {
        const response = await fetch(`${apiUrl}/categories`, {
            credentials: "include",
            method: "GET",
        });

        const resp = await response.json();

        if (!response.ok) {
            throw new Error(
                resp.message || "Erreur lors du chargement des catégories",
            );
        }

        categories = Array.isArray(resp.data) ? resp.data : [];
    }

    onMount(async () => {
        try {
            loading = true;
            await Promise.all([fetchEvents(), fetchCategories()]);
        } catch (e) {
            console.error(e);
            toast.error(e.message || "Erreur du serveur");
        } finally {
            loading = false;
        }
    });

    $: categoryFilters = [
        { name: "Tous", slug: "tous" },
        ...categories.map((item) => ({ name: item.name, slug: item.slug })),
    ];

    $: baseResults = events.filter((event) => {
        const q = search.trim().toLowerCase();

        const searchableText = [
            event.title,
            event.city,
            event.venue,
            event.description,
            event.category?.name,
            ...(event.tags?.map((tag) => tag.name) ?? []),
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesQuery = !q || searchableText.includes(q);
        const matchesCategory =
            activeCat === "Tous" || event.category?.name === activeCat;
        const matchesCity =
            activeCity === "Toutes les villes" || event.city === activeCity;

        return matchesQuery && matchesCategory && matchesCity;
    });

    $: cities = [
        "Toutes les villes",
        ...Array.from(
            new Set(events.map((event) => event.city).filter(Boolean)),
        ),
    ];

    $: sortedEvents = [...baseResults].sort((a, b) => {
        if (sort === "date_asc") {
            return new Date(a.dateStart) - new Date(b.dateStart);
        }

        if (sort === "price_asc") {
            return getLowestPrice(a) - getLowestPrice(b);
        }

        if (sort === "price_desc") {
            return getLowestPrice(b) - getLowestPrice(a);
        }

        return (
            Number(b.isVedette) - Number(a.isVedette) ||
            new Date(b.dateStart) - new Date(a.dateStart)
        );
    });

    $: hasFilters =
        Boolean(search) ||
        activeCat !== "Tous" ||
        activeCity !== "Toutes les villes";

    function clearFilters() {
        search = "";
        activeCat = "Tous";
        activeCity = "Toutes les villes";
        sort = "relevance";
    }
</script>

<Navbar />

<div class="min-h-screen bg-base-100 pt-[68px]">
    <div
        class="relative bg-base-200 border-b border-primary/10 py-12 px-4 overflow-hidden"
    >
        <div class="max-w-7xl mx-auto relative z-10">
            <div
                class="badge badge-outline border-primary/25 text-primary text-[10px] uppercase tracking-[0.25em] py-2 px-4 gap-1.5 mb-4"
            >
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                ></span>
                {sortedEvents.length} événements disponibles
            </div>

            <h1
                class="font-display font-bold text-base-content mb-3"
                style="font-size: clamp(2rem, 5vw, 3rem)"
            >
                Explorer tous les <span class="italic font-light text-primary"
                    >événements</span
                >
            </h1>

            <p class="text-sm text-base-content/45 max-w-2xl">
                Concerts, expositions, conférences, galas — trouvez l’expérience
                qui vous correspond.
            </p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
                <input
                    type="text"
                    bind:value={search}
                    placeholder="Rechercher un événement, une ville, un thème..."
                    class="input input-bordered w-full pr-10 bg-base-200 border-primary/15 focus:border-primary/50 text-sm rounded-xl h-11"
                />

                {#if search}
                    <button
                        on:click={() => (search = "")}
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-primary"
                    >
                        <X size={15} />
                    </button>
                {/if}
            </div>

            <button
                on:click={() => (filtersOpen = !filtersOpen)}
                class={`btn btn-sm rounded-xl gap-2 text-xs uppercase tracking-wider h-11 px-5 ${
                    filtersOpen || hasFilters
                        ? "btn-primary"
                        : "btn-ghost border border-primary/15 text-base-content/50"
                }`}
            >
                <SlidersHorizontal size={14} />
                Filtres
            </button>

            <select
                bind:value={sort}
                class="select select-bordered select-sm w-full md:w-min bg-base-200 border-primary/15 text-sm rounded-xl h-11 min-h-0"
            >
                <option value="relevance">Pertinence</option>
                <option value="date_asc">Date croissante</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
            </select>
        </div>

        {#if filtersOpen}
            <div
                class="card bg-base-200 border border-primary/10 p-5 flex flex-col gap-5 mb-6"
            >
                <div>
                    <p
                        class="text-[10px] uppercase tracking-[0.2em] text-base-content/35 mb-3"
                    >
                        Catégorie
                    </p>

                    <div class="flex flex-wrap gap-2">
                        {#each categoryFilters as category}
                            <button
                                on:click={() => (activeCat = category.name)}
                                class={`badge py-3 px-3 text-[11px] cursor-pointer ${
                                    activeCat === category.name
                                        ? "badge-primary"
                                        : "badge-outline border-primary/12 text-base-content/45"
                                }`}
                            >
                                {category.name}
                            </button>
                        {/each}
                    </div>
                </div>

                <div>
                    <p
                        class="text-[10px] uppercase tracking-[0.2em] text-base-content/35 mb-3"
                    >
                        Ville
                    </p>

                    <div class="flex flex-wrap gap-2">
                        {#each cities as city}
                            <button
                                on:click={() => (activeCity = city)}
                                class={`badge py-3 px-3 text-[11px] cursor-pointer ${
                                    activeCity === city
                                        ? "badge-primary"
                                        : "badge-outline border-primary/12 text-base-content/45"
                                }`}
                            >
                                {city}
                            </button>
                        {/each}
                    </div>
                </div>

                {#if hasFilters}
                    <div>
                        <button
                            on:click={clearFilters}
                            class="btn btn-ghost btn-sm rounded-full text-xs uppercase tracking-wider border border-primary/15"
                        >
                            Réinitialiser
                        </button>
                    </div>
                {/if}
            </div>
        {/if}

        {#if loading}
            <Shimmer />
        {:else}
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
            >
                {#if sortedEvents.length > 0}
                    {#each sortedEvents as event}
                        <EventCard {event} />
                    {/each}
                {:else}
                    <div class="col-span-full text-center py-16">
                        <div class="text-4xl mb-3 flex justify-center">
                            <Search />
                        </div>
                        <p class="text-base font-semibold text-base-content">
                            Aucun événement trouvé
                        </p>
                        <p class="text-sm text-base-content/45 mt-2">
                            Ajuste tes filtres ou remets la recherche à zéro.
                        </p>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<Footer />
