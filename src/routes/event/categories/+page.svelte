<script>
    import Footer from "$lib/components/layout/Footer.svelte";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Shimmer from "$lib/components/shimmer.svelte";
    import { apiUrl } from "$lib/utils/api_url";
    import { ArrowUpRight, Flame } from "lucide-svelte";

    let categories = [];
    let loading = true;

    async function loadMeta() {
        try {
            const [catRes] = await Promise.all([fetch(`${apiUrl}/categories`)]);
            const catJson = await catRes.json();
            if (catJson.status) categories = catJson.data ?? [];
        } catch (e) {
            console.error("[LOAD_META]", e);
        } finally {
            loading = false;
        }
    }

    loadMeta();

    // Détermine la taille de chaque carte selon sa position
    // 0 → large (col-span-2), 1,2 → medium, 3 → wide (col-span-2), 4,5 → medium, etc.
    function cardSize(index) {
        const pattern = index % 6;
        if (pattern === 0 || pattern === 3) return "large";
        return "medium";
    }

    // Les 3 catégories avec le plus d'events → badge tendance
    $: trending = [...categories]
        .sort((a, b) => (b._count?.events ?? 0) - (a._count?.events ?? 0))
        .slice(0, 3)
        .map((c) => c.id);
</script>

<Navbar />

<div class="min-h-screen bg-base-100 pt-[68px]">
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <div
        class="relative bg-base-200 border-b border-primary/10 py-14 px-4 overflow-hidden"
    >
        <!-- Blob décoratif -->
        <div
            class="absolute -top-16 -right-16 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none"
        ></div>
        <div
            class="absolute bottom-0 left-1/3 w-48 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"
        ></div>

        <div class="max-w-7xl mx-auto relative">
            <p
                class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-l-2 border-primary pl-3 mb-4"
            >
                Toutes les catégories
            </p>
            <h1
                class="font-bold text-base-content leading-tight mb-3"
                style="font-size: clamp(2rem, 4vw, 3rem)"
            >
                Explorer par <span class="italic font-light text-primary"
                    >catégorie</span
                >
            </h1>
            <p class="text-sm text-base-content/45 max-w-xl leading-relaxed">
                Chaque catégorie est une porte ouverte sur une expérience
                unique. Concerts intimes, galas de prestige, expos d'avant-garde
                — votre prochaine émotion commence ici.
            </p>
        </div>
    </div>

    <!-- ── Contenu ──────────────────────────────────────────────────────────── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {#if loading}
            <Shimmer />
        {:else if categories.length === 0}
            <div class="flex flex-col items-center gap-3 py-24 text-center">
                <p class="text-base-content/30 text-sm">
                    Aucune catégorie disponible.
                </p>
            </div>
        {:else}
            <!-- ── Masonry grid ───────────────────────────────────────────────── -->
            <!-- CSS grid 4 colonnes — les "large" occupent col-span-2           -->
            <div
                class="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]"
            >
                {#each categories as cat, i (cat.id)}
                    {@const size = cardSize(i)}
                    {@const isTrending = trending.includes(cat.id)}

                    <a
                        href={`categories/${cat.slug}`}
                        class="group relative rounded-2xl overflow-hidden
                               {size === 'large'
                            ? 'col-span-2 row-span-2'
                            : 'col-span-1 row-span-1'}"
                    >
                        <!-- Image fond full-bleed -->
                        {#if cat.icon}
                            <img
                                src={cat.icon}
                                alt={cat.name}
                                class="absolute inset-0 w-full h-full object-cover
                                       group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        {:else}
                            <!-- Fallback dégradé avec initiales -->
                            <div
                                class="absolute inset-0 bg-linear-to-br from-primary/25 via-base-300 to-base-200"
                            ></div>
                            <span
                                class="absolute inset-0 flex items-center justify-center
                                         text-[5rem] font-black text-primary/10 pointer-events-none select-none"
                            >
                                {cat.name?.slice(0, 2).toUpperCase()}
                            </span>
                        {/if}

                        <!-- Overlay gradient — plus sombre vers le bas -->
                        <div
                            class="absolute inset-0 bg-linear-to-t
                                    {size === 'large'
                                ? 'from-black/85 via-black/30 to-black/10'
                                : 'from-black/80 via-black/20 to-transparent'}"
                        ></div>

                        <!-- Contenu overlay -->
                        <div
                            class="absolute inset-0 p-4 {size === 'large'
                                ? 'p-6'
                                : 'p-4'} flex flex-col justify-between"
                        >
                            <!-- Badges haut -->
                            <div class="flex items-start justify-between">
                                {#if isTrending}
                                    <span
                                        class="badge badge-warning gap-1 text-[9px] uppercase tracking-wider font-bold py-2 px-2.5 shadow-lg"
                                    >
                                        <Flame size={8} fill="currentColor" />
                                        Tendance
                                    </span>
                                {:else}
                                    <span></span>
                                {/if}

                                <!-- Compteur events -->
                                <span
                                    class="badge bg-black/40 backdrop-blur-sm border border-white/10
                                             text-white/60 text-[9px] font-bold uppercase tracking-wider
                                             py-2 px-2.5"
                                >
                                    {cat._count?.events ?? 0} evt
                                </span>
                            </div>

                            <!-- Titre + CTA bas -->
                            <div>
                                <h2
                                    class="font-bold text-white leading-tight mb-1
                                           {size === 'large'
                                        ? 'text-2xl sm:text-3xl'
                                        : 'text-base sm:text-lg'}"
                                >
                                    {cat.name}
                                </h2>

                                {#if size === "large" && cat.description}
                                    <p
                                        class="text-xs text-white/55 leading-relaxed mb-4 line-clamp-2 max-w-sm"
                                    >
                                        {cat.description}
                                    </p>
                                {/if}

                                <div
                                    class="flex items-center justify-between gap-2"
                                >
                                    <p
                                        class="text-[10px] uppercase tracking-widest text-white/35 font-semibold"
                                    >
                                        {cat._count?.events ?? 0} événement{(cat
                                            ._count?.events ?? 0) > 1
                                            ? "s"
                                            : ""}
                                    </p>
                                    <div
                                        class="w-8 h-8 rounded-full
                                                bg-white/15 backdrop-blur-sm border border-white/20
                                                group-hover:bg-primary group-hover:border-primary
                                                flex items-center justify-center
                                                transition-all duration-300 shrink-0"
                                    >
                                        <ArrowUpRight
                                            size={14}
                                            class="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bordure hover subtile -->
                        <div
                            class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0
                                    group-hover:ring-primary/50 transition-all duration-300 pointer-events-none"
                        ></div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</div>

<Footer />
