<script>
    import { Calendar, MapPin, Wifi, Star, ArrowUpRight } from "lucide-svelte";
    import { imageUrl } from "$lib/utils/api_url";

    /** @type {object} */
    export let event;
    /** @type {number|null} */
    export let index = null;
    /** @type {boolean} */
    export let showVedette = false;

    function imgSrc(path) {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${imageUrl}/${path}`;
    }

    function formatDate(iso) {
        if (!iso) return "Date à confirmer";
        return new Date(iso).toLocaleDateString("fr-FR", {
            day: "2-digit", month: "long", year: "numeric",
        });
    }

    function getLocation(ev) {
        if (ev?.isOnline) return "En ligne";
        return [ev?.venue, ev?.city].filter(Boolean).join(" · ") || "Lieu à confirmer";
    }

    function getPrice(ev) {
        if (ev?.isFree) return "Gratuit";
        const prices = (ev?.tickets ?? []).map(t => Number(t.price)).filter(p => !isNaN(p));
        if (!prices.length) return "Prix à venir";
        const min = Math.min(...prices);
        return min === 0 ? "Gratuit" : `${(min / 100).toLocaleString("fr-FR")} FCFA`;
    }

    $: src      = imgSrc(event?.coverImage);
    $: date     = formatDate(event?.dateStart);
    $: location = getLocation(event);
    $: price    = getPrice(event);
    $: num      = index !== null ? String(index + 1).padStart(2, "0") : null;
</script>

<a
    href={`/event/${event?.id}`}
    class="group card bg-base-200 border border-base-300
           hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10
           overflow-hidden transition-all duration-300"
>
    <!-- ── Image ──────────────────────────────────────────────────────────── -->
    <figure class="relative h-52 overflow-hidden bg-base-300 shrink-0">
        {#if src}
            <img
                {src}
                alt={event?.title}
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        {:else}
            <div class="absolute inset-0 bg-linear-to-br from-primary/20 to-base-300 flex items-center justify-center">
                <span class="text-6xl font-black text-primary/10">
                    {event?.title?.slice(0, 2).toUpperCase()}
                </span>
            </div>
        {/if}

        <!-- Overlay gradient fort vers le bas pour lisibilité -->
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

        <!-- Numéro optionnel haut gauche -->
        {#if num}
            <span class="absolute top-3 left-3 text-[9px] font-black text-white/40 tracking-[0.2em]">
                {num}
            </span>
        {/if}

        <!-- Badges haut droite -->
        <div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {#if showVedette || event?.isVedette}
                <span class="badge badge-warning gap-1 text-[8px] font-bold py-1.5 px-2 shadow-lg">
                    <Star size={7} fill="currentColor" /> Vedette
                </span>
            {/if}
        </div>

        <!-- Catégorie + prix en bas de l'image (sur overlay sombre) -->
        <div class="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between gap-2">
            {#if event?.category?.name}
                <span class="badge badge-primary badge-sm font-bold uppercase tracking-wider text-[9px] px-2.5 py-2 shadow-md">
                    {event.category.name}
                </span>
            {/if}
            <span class="ml-auto font-black text-white text-sm drop-shadow-md">
                {price}
            </span>
        </div>
    </figure>

    <!-- ── Body ───────────────────────────────────────────────────────────── -->
    <div class="card-body p-4 gap-2">

        <!-- Titre -->
        <h3 class="font-bold text-base-content text-sm leading-snug line-clamp-2
                   group-hover:text-primary transition-colors duration-200">
            {event?.title}
        </h3>

        <!-- Meta date + lieu -->
        <div class="flex flex-col gap-1 mt-0.5">
            <span class="flex items-center gap-1.5 text-[11px] text-base-content/55 font-medium">
                <Calendar size={11} class="text-primary shrink-0" />
                {date}{event?.timeStart ? ` · ${event.timeStart}` : ""}
            </span>
            <span class="flex items-center gap-1.5 text-[11px] text-base-content/55 font-medium truncate">
                <svelte:component this={event?.isOnline ? Wifi : MapPin} size={11} class="text-primary shrink-0" />
                {location}
            </span>
        </div>

        <!-- Footer : prix répété + CTA -->
        <div class="flex items-center justify-between pt-2 mt-auto border-t border-base-300">
            <div>
                <p class="text-[9px] uppercase tracking-widest text-base-content/25 font-semibold leading-none mb-0.5">
                    {event?.isFree ? "Tarif" : "À partir de"}
                </p>
                <p class="font-black text-primary text-sm leading-none">{price}</p>
            </div>
            <span class="btn btn-primary btn-xs rounded-xl gap-1 text-[9px] uppercase tracking-wider font-bold px-3">
                Voir <ArrowUpRight size={11} />
            </span>
        </div>
    </div>
</a>