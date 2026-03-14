<script>
  import { fade } from "svelte/transition";
  import { ArrowRight, Search } from "lucide-svelte";
  import { reveal } from "$lib/actions/reveal";
  import EventCard from "$lib/components/EventCard.svelte";
  import FeaturedEventCard from "$lib/components/FeaturedEventCard.svelte";
  import { apiUrl } from "$lib/utils/api_url";
  import { onMount } from "svelte";

  /** @type {Array} */
  let events = [];
  /** @type {Array<{name:string, slug:string}>} */
  let categories = [{ name: "Tous", slug: "tous" }];

  let activeCategory = "Tous";
  let loading = true;

  async function loadData() {
    try {
      const [evRes, catRes] = await Promise.all([
        fetch(`${apiUrl}/events`),
        fetch(`${apiUrl}/categories`),
      ]);
      const [evJson, catJson] = await Promise.all([
        evRes.json(),
        catRes.json(),
      ]);

      events = evJson.data ?? evJson.events ?? [];
      categories = [
        { name: "Tous", slug: "tous" },
        ...(catJson.data ?? catJson.categories ?? []).map((c) => ({
          name: c.name,
          slug: c.slug,
        })),
      ];
    } catch (e) {
      console.error("[EventsGrid]", e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadData();
  });

  $: featured = events.find((e) => e.isVedette) ?? null;

  $: filtered = (() => {
    const base = events.filter((e) => e.id !== featured?.id);
    if (activeCategory === "Tous") return base;
    return base.filter(
      (e) =>
        e.category?.name === activeCategory || e.category === activeCategory,
    );
  })();
</script>

<section id="events" class="py-20 lg:py-32 bg-base-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div
      use:reveal
      class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
    >
      <div>
        <p
          class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2"
        >
          Programme
        </p>
        <h2
          class="font-bold text-base-content leading-tight"
          style="font-size: clamp(1.8rem, 3vw, 2.6rem)"
        >
          Événements <em class="font-light text-primary not-italic"
            >en vedette</em
          >
        </h2>
      </div>
      <a
        href="/event/vedette"
        class="btn btn-outline btn-primary rounded-full gap-2 text-xs uppercase tracking-widest shrink-0 self-start lg:self-auto"
      >
        Voir tout <ArrowRight size={14} />
      </a>
    </div>

    <!-- Featured card -->
    {#if featured && activeCategory === "Tous" && !loading}
      <div class="mb-10" use:reveal>
        <FeaturedEventCard event={featured} />
      </div>
    {/if}

    <!-- Filtres catégories -->
    <div class="flex flex-wrap gap-2 mb-8" use:reveal={{ delay: 80 }}>
      {#if loading}
        {#each Array(5) as _}
          <div class="skeleton h-8 w-20 rounded-full"></div>
        {/each}
      {:else}
        {#each categories as cat (cat.slug)}
          <button
            type="button"
            on:click={() => (activeCategory = cat.name)}
            class="btn btn-sm rounded-full gap-1.5 text-xs uppercase tracking-wider transition-all duration-200
                   {activeCategory === cat.name
              ? 'btn-primary'
              : 'btn-ghost border border-primary/12 text-base-content/40 hover:border-primary/30'}"
          >
            {cat.name}
          </button>
        {/each}
      {/if}
    </div>

    <!-- Grille -->
    {#key activeCategory}
      <div
        out:fade={{ duration: 150 }}
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {#if loading}
          {#each Array(6) as _}
            <div class="skeleton h-72 rounded-2xl"></div>
          {/each}
        {:else if filtered.length > 0}
          {#each filtered as event, i (event.id)}
            <div use:reveal={{ delay: i * 90 }}>
              <EventCard {event} />
            </div>
          {/each}
        {:else}
          <div
            class="col-span-full flex flex-col items-center gap-3 py-16 text-center"
            use:reveal
          >
            <Search size={32} class="text-base-content/15" />
            <p class="text-base-content/35 text-sm">
              Aucun événement dans cette catégorie pour le moment.
            </p>
            <button
              type="button"
              on:click={() => (activeCategory = "Tous")}
              class="btn btn-ghost btn-sm rounded-full text-xs uppercase tracking-wider mt-1"
            >
              Voir tous les événements
            </button>
          </div>
        {/if}
      </div>
    {/key}

    <!-- CTA -->
    {#if !loading && filtered.length > 0}
      <div class="flex justify-center mt-12" use:reveal={{ delay: 120 }}>
        <a
          href="/event"
          class="btn btn-outline btn-primary rounded-full gap-2 text-xs uppercase tracking-widest px-10"
        >
          Voir plus d'événements <ArrowRight size={14} />
        </a>
      </div>
    {/if}
  </div>
</section>
