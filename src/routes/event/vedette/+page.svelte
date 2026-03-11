<script>
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import { apiUrl, imageUrl } from "$lib/utils/api_url";
    import {
        Calendar,
        MapPin,
        Wifi,
        ArrowRight,
        Star,
        Ticket,
        ArrowUpRight,
    } from "lucide-svelte";
    import VedetteCard from "$lib/components/VedetteCard.svelte";

    /** @type {Array} */
    let events = [];
    let loading = true;
    let error = "";

    async function fetchVedette() {
        loading = true;
        error = "";
        try {
            const res = await fetch(`${apiUrl}/events`, {
                credentials: "include",
            });
            const json = await res.json();
            if (!json.status) throw new Error(json.message ?? "Erreur");
            events = (json.data ?? []).filter((ev) => ev.isVedette === true);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    fetchVedette();

    function formatDate(iso) {
        if (!iso) return "Date à confirmer";
        return new Date(iso).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function imgSrc(path) {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${imageUrl}/${path}`;
    }

    function getPrice(ev) {
        if (ev.isFree) return "Gratuit";
        const prices = (ev.tickets ?? [])
            .map((t) => Number(t.price))
            .filter((p) => !isNaN(p));
        if (!prices.length) return "Prix à venir";
        const min = Math.min(...prices);
        if (min === 0) return "Gratuit";
        return `${(min / 100).toLocaleString("fr-FR")} FCFA`;
    }

    function getLocation(ev) {
        if (ev.isOnline) return "En ligne";
        return (
            [ev.venue, ev.city].filter(Boolean).join(" · ") ||
            "Lieu à confirmer"
        );
    }

    $: hero = events[0] ?? null;
    $: secondaries = events.slice(1, 3);
    $: rest = events.slice(3);
</script>

<Navbar />

<div class="min-h-screen bg-base-100 pt-[68px] overflow-x-hidden">
    <!-- ══════════════════════════════════════════════════
         HERO CINÉMATIQUE
    ══════════════════════════════════════════════════ -->
    {#if !loading && hero}
        <section class="relative h-[90vh] min-h-[600px] overflow-hidden">
            <!-- Image plein écran -->
            {#if imgSrc(hero.coverImage)}
                <img
                    src={imgSrc(hero.coverImage)}
                    alt={hero.title}
                    class="absolute inset-0 w-full h-full object-cover"
                    style="animation: slowZoom 12s ease-out forwards"
                />
            {:else}
                <div
                    class="absolute inset-0 bg-linear-to-br from-primary/30 via-base-300 to-base-100"
                ></div>
            {/if}

            <!-- Overlay en dégradé riche -->
            <div
                class="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/50 to-black/20"
            ></div>
            <div
                class="absolute inset-0 bg-linear-to-r from-base-100/80 via-base-100/20 to-transparent"
            ></div>

            <!-- Numéro décoratif géant -->
            <div
                class="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none"
            >
                <span
                    class="text-[18rem] font-black text-primary/5 leading-none"
                    style="line-height:1">01</span
                >
            </div>

            <!-- Contenu héro -->
            <div
                class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16"
            >
                <!-- Label catégorie + vedette -->
                <div class="flex items-center gap-3 mb-6">
                    <div class="h-px w-12 bg-primary"></div>
                    <span
                        class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary"
                    >
                        Sélection vedette
                    </span>
                    <div class="h-px w-12 bg-primary/30"></div>
                    <span
                        class="badge badge-warning gap-1 text-[9px] uppercase tracking-wider font-bold py-2 px-2.5"
                    >
                        <Star size={8} fill="currentColor" />
                        {hero.category?.name ?? "Événement"}
                    </span>
                </div>

                <!-- Titre massif -->
                <h1
                    class="font-bold text-base-content leading-[0.95] mb-5 max-w-3xl"
                    style="font-size: clamp(1.8rem, 4vw, 3rem)"
                >
                    {hero.title}
                </h1>

                <!-- Description -->
                {#if hero.description}
                    <p
                        class="text-base-content/50 text-sm leading-relaxed mb-8 max-w-xl line-clamp-2"
                    >
                        {hero.description}
                    </p>
                {/if}

                <!-- Footer hero : meta + CTA -->
                <div class="flex flex-wrap items-center justify-between gap-6">
                    <!-- Meta chips -->
                    <div class="flex flex-wrap items-center gap-2">
                        <span
                            class="flex items-center gap-2 text-xs font-medium text-base-content/60
                                     bg-base-100/60 backdrop-blur-md border border-base-300 rounded-full px-4 py-2"
                        >
                            <Calendar size={12} class="text-primary" />
                            {formatDate(hero.dateStart)}
                            {#if hero.timeStart}<span
                                    class="text-base-content/30">·</span
                                >
                                {hero.timeStart}{/if}
                        </span>
                        <span
                            class="flex items-center gap-2 text-xs font-medium text-base-content/60
                                     bg-base-100/60 backdrop-blur-md border border-base-300 rounded-full px-4 py-2"
                        >
                            <svelte:component
                                this={hero.isOnline ? Wifi : MapPin}
                                size={12}
                                class="text-primary"
                            />
                            {getLocation(hero)}
                        </span>
                        <span
                            class="flex items-center gap-2 text-xs font-black text-primary
                                     bg-primary/10 border border-primary/25 rounded-full px-4 py-2"
                        >
                            <Ticket size={12} />
                            {getPrice(hero)}
                        </span>
                    </div>

                    <!-- CTA -->
                    <a
                        href={`/event/${hero.id}`}
                        class="group flex items-center gap-3 btn btn-primary rounded-full px-8 h-13 text-xs uppercase tracking-widest font-bold
                               shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow duration-300"
                    >
                        Découvrir l'événement
                        <span
                            class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center
                                     group-hover:bg-white/30 transition-colors duration-200"
                        >
                            <ArrowRight size={12} />
                        </span>
                    </a>
                </div>
            </div>

            <!-- Indicateur scroll -->
            <div
                class="absolute bottom-6 right-6 flex flex-col items-center gap-1.5 opacity-30"
            >
                <div
                    class="w-px h-10 bg-base-content/40"
                    style="animation: scrollLine 2s ease-in-out infinite"
                ></div>
                <span
                    class="text-[9px] uppercase tracking-[0.2em] text-base-content/40 font-semibold"
                    style="writing-mode:vertical-rl">Défiler</span
                >
            </div>
        </section>
    {/if}

    <!-- ══════════════════════════════════════════════════
         CONTENU PRINCIPAL
    ══════════════════════════════════════════════════ -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- ── Header section ─────────────────────────────────────────────── -->
        {#if !loading}
            <div
                class="flex items-end justify-between mb-12 pb-6 border-b border-base-300"
            >
                <div>
                    <p
                        class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2"
                    >
                        Notre sélection
                    </p>
                    <h2
                        class="font-bold text-base-content leading-tight"
                        style="font-size: clamp(1.8rem, 3vw, 2.6rem)"
                    >
                        Événements <em
                            class="font-light text-primary not-italic"
                            >en vedette</em
                        >
                    </h2>
                </div>
                {#if events.length > 0}
                    <div class="hidden sm:flex items-center gap-1 text-right">
                        <span
                            class="text-5xl font-black text-primary/15 leading-none"
                            >{events.length}</span
                        >
                        <div class="text-left ml-1">
                            <p
                                class="text-[9px] uppercase tracking-widest text-base-content/25 font-semibold leading-tight"
                            >
                                événements
                            </p>
                            <p
                                class="text-[9px] uppercase tracking-widest text-base-content/20 font-semibold leading-tight"
                            >
                                sélectionnés
                            </p>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- ── Loading ────────────────────────────────────────────────────── -->
        {#if loading}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="skeleton h-[460px] rounded-2xl lg:row-span-2"></div>
                <div class="skeleton h-52 rounded-2xl"></div>
                <div class="skeleton h-52 rounded-2xl"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                {#each Array(3) as _}
                    <div class="skeleton h-64 rounded-2xl"></div>
                {/each}
            </div>

            <!-- ── Erreur ──────────────────────────────────────────────────────── -->
        {:else if error}
            <div class="flex flex-col items-center gap-4 py-20 text-center">
                <p class="text-base-content/35 text-sm">{error}</p>
                <button
                    type="button"
                    on:click={fetchVedette}
                    class="btn btn-primary btn-sm rounded-full"
                    >Réessayer</button
                >
            </div>

            <!-- ── Vide ───────────────────────────────────────────────────────── -->
        {:else if events.length === 0}
            <div class="flex flex-col items-center gap-4 py-24 text-center">
                <div
                    class="w-20 h-20 rounded-3xl bg-base-200 border border-base-300 flex items-center justify-center mb-2"
                >
                    <Star size={32} class="text-primary/20" />
                </div>
                <p class="font-bold text-lg text-base-content/30">
                    Aucun événement vedette
                </p>
                <p class="text-sm text-base-content/20 max-w-xs">
                    Notre équipe prépare une sélection exceptionnelle. Revenez
                    bientôt.
                </p>
                <a
                    href="/events"
                    class="btn btn-outline btn-sm rounded-full text-xs uppercase tracking-wider mt-3 gap-2"
                >
                    Tous les événements <ArrowRight size={12} />
                </a>
            </div>

            <!-- ── Layout éditorial ───────────────────────────────────────────── -->
        {:else}
            <!-- Duo asymétrique : grande carte + 2 cartes empilées -->
            {#if events.length >= 2}
                <div
                    class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-5"
                >
                    <!-- Grande carte (item 1 = hero, déjà affiché en hero section mais ici dans la grille) -->
                    {#if secondaries[0]}
                        {@const ev = secondaries[0]}
                        <a
                            href={`/event/${ev.id}`}
                            class="group relative rounded-2xl overflow-hidden h-[420px] lg:row-span-2 block"
                        >
                            <!-- Numéro -->
                            <span
                                class="absolute top-5 left-5 z-10 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase"
                            >
                                02
                            </span>
                            {#if imgSrc(ev.coverImage)}
                                <img
                                    src={imgSrc(ev.coverImage)}
                                    alt={ev.title}
                                    class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            {:else}
                                <div
                                    class="absolute inset-0 bg-linear-to-br from-primary/20 via-base-300 to-base-200"
                                ></div>
                            {/if}
                            <div
                                class="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/10"
                            ></div>

                            <div
                                class="absolute inset-0 p-6 flex flex-col justify-between"
                            >
                                <div class="flex justify-end">
                                    <span
                                        class="badge badge-warning gap-1 text-[9px] font-bold py-2 px-2.5 shadow-lg"
                                    >
                                        <Star size={8} fill="currentColor" /> Vedette
                                    </span>
                                </div>
                                <div>
                                    {#if ev.category?.name}
                                        <p
                                            class="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2"
                                        >
                                            {ev.category.name}
                                        </p>
                                    {/if}
                                    <h3
                                        class="font-bold text-white leading-snug mb-2 text-xl"
                                    >
                                        {ev.title}
                                    </h3>
                                    {#if ev.description}
                                        <p
                                            class="text-xs text-white/45 line-clamp-2 leading-relaxed mb-4"
                                        >
                                            {ev.description}
                                        </p>
                                    {/if}
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <div class="flex flex-col gap-1">
                                            <span
                                                class="flex items-center gap-1.5 text-[11px] text-white/50"
                                            >
                                                <Calendar
                                                    size={11}
                                                    class="text-primary/70"
                                                />
                                                {formatDate(ev.dateStart)}
                                            </span>
                                            <span
                                                class="flex items-center gap-1.5 text-[11px] text-white/50"
                                            >
                                                <svelte:component
                                                    this={ev.isOnline
                                                        ? Wifi
                                                        : MapPin}
                                                    size={11}
                                                    class="text-primary/70"
                                                />
                                                {getLocation(ev)}
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span
                                                class="font-black text-primary text-base"
                                                >{getPrice(ev)}</span
                                            >
                                            <div
                                                class="w-9 h-9 rounded-full bg-primary flex items-center justify-center
                                                        group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-primary/40"
                                            >
                                                <ArrowUpRight
                                                    size={15}
                                                    class="text-primary-content"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/if}

                    <!-- 2 cartes horizontales empilées -->
                    {#each secondaries.slice(1, 3) as ev, i}
                        <a
                            href={`/event/${ev.id}`}
                            class="group card bg-base-200 border border-base-300 hover:border-primary/35
                                  hover:shadow-lg hover:shadow-primary/8 overflow-hidden transition-all duration-300 flex-row"
                        >
                            <!-- Image -->
                            <div
                                class="relative w-36 sm:w-44 shrink-0 overflow-hidden"
                            >
                                {#if imgSrc(ev.coverImage)}
                                    <img
                                        src={imgSrc(ev.coverImage)}
                                        alt={ev.title}
                                        class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                {:else}
                                    <div
                                        class="absolute inset-0 bg-linear-to-b from-primary/20 to-base-300 flex items-center justify-center"
                                    >
                                        <span
                                            class="text-3xl font-black text-primary/15"
                                            >{ev.title
                                                ?.slice(0, 2)
                                                .toUpperCase()}</span
                                        >
                                    </div>
                                {/if}
                                <!-- Numéro -->
                                <span
                                    class="absolute top-2 left-2 text-[9px] font-black text-white/30 tracking-widest"
                                    >0{i + 3}</span
                                >
                            </div>
                            <!-- Contenu -->
                            <div
                                class="flex-1 p-4 flex flex-col justify-between min-w-0"
                            >
                                <div>
                                    <div
                                        class="flex items-center justify-between gap-2 mb-1.5"
                                    >
                                        {#if ev.category?.name}
                                            <span
                                                class="text-[9px] uppercase tracking-widest text-primary font-bold"
                                                >{ev.category.name}</span
                                            >
                                        {/if}
                                        <span
                                            class="badge badge-warning badge-xs gap-1 font-bold text-[8px] shrink-0"
                                        >
                                            <Star
                                                size={7}
                                                fill="currentColor"
                                            /> Vedette
                                        </span>
                                    </div>
                                    <h3
                                        class="font-bold text-sm text-base-content leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200"
                                    >
                                        {ev.title}
                                    </h3>
                                </div>
                                <div>
                                    <p
                                        class="text-[11px] text-base-content/40 mb-2 flex items-center gap-1.5"
                                    >
                                        <Calendar
                                            size={10}
                                            class="text-primary/60 shrink-0"
                                        />
                                        {formatDate(ev.dateStart)}
                                    </p>
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="font-black text-primary text-sm"
                                            >{getPrice(ev)}</span
                                        >
                                        <ArrowUpRight
                                            size={14}
                                            class="text-base-content/20 group-hover:text-primary transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}

            <!-- Séparateur éditorial -->
            {#if rest.length > 0}
                <div class="flex items-center gap-4 my-10">
                    <div class="h-px flex-1 bg-base-300"></div>
                    <span
                        class="text-[9px] uppercase tracking-[0.3em] text-base-content/25 font-bold"
                        >Plus en vedette</span
                    >
                    <div class="h-px flex-1 bg-base-300"></div>
                </div>

                <!-- Grille 3 colonnes pour le reste -->
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {#each rest as ev, i (ev.id)}
                        <VedetteCard event={ev} index={i} showVedette />
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>

<Footer />

<style>
    @keyframes slowZoom {
        from {
            transform: scale(1.08);
        }
        to {
            transform: scale(1);
        }
    }
    @keyframes scrollLine {
        0%,
        100% {
            opacity: 0.3;
            transform: scaleY(1);
        }
        50% {
            opacity: 0.8;
            transform: scaleY(1.3);
        }
    }
</style>