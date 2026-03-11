<script>
    import { fly, fade } from "svelte/transition";
    import {
        Calendar,
        MapPin,
        Users,
        ArrowRight,
        Star,
        Ticket,
    } from "lucide-svelte";
    import { imageUrl } from "$lib/utils/api_url";

    /** @type {import('$lib/types').Event} */
    export let event;

    $: image = event?.coverImage
        ? `${imageUrl}/${event.coverImage}`
        : (event?.image ?? "");
    $: date = formatDate(event?.dateStart);
    $: time = event?.timeStart ?? "";
    $: location = event?.isOnline
        ? "En ligne"
        : [event?.venue, event?.city].filter(Boolean).join(", ") ||
          "Lieu à confirmer";
    $: price = getLowestPrice(event);
    $: category = event?.category?.name ?? event?.category ?? "Événement";
    $: spotsLeft = resolveSpotsLeft(event);

    function formatDate(d) {
        if (!d) return "Date à confirmer";
        return new Date(d).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function getLowestPrice(ev) {
        if (ev?.isFree) return "Gratuit";
        if (!ev?.tickets?.length) return ev?.price ?? "Prix à venir";
        const prices = ev.tickets
            .map((t) => Number(t.price))
            .filter((p) => !isNaN(p));
        if (!prices.length) return "Prix à venir";
        return `${Math.min(...prices).toLocaleString("fr-FR")} FCFA`;
    }

    function resolveSpotsLeft(ev) {
        if (!ev?.capacity) return null;
        const sold = ev?.tickets?.reduce((a, t) => a + (t.sold ?? 0), 0) ?? 0;
        return Math.max(0, ev.capacity - sold);
    }
</script>

<div
    in:fly={{ y: 40, duration: 700 }}
    class="card lg:card-side bg-base-200 border border-primary/15 hover:border-primary/40
         overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
>
    <!-- ── Image ────────────────────────────────────────────────────────────── -->
    <figure class="relative lg:w-[55%] h-64 lg:h-auto overflow-hidden shrink-0">
        <!-- Image avec zoom -->
        <div
            class="absolute inset-0 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        >
            {#if image}
                <img
                    src={image}
                    alt={event?.title}
                    class="w-full h-full object-cover"
                    loading="eager"
                />
            {:else}
                <div
                    class="w-full h-full bg-base-300 flex items-center justify-center"
                >
                    <MapPin size={40} class="text-base-content/10" />
                </div>
            {/if}
        </div>

        <!-- Gradient desktop (droite) -->
        <div
            class="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-base-200/50 hidden lg:block pointer-events-none"
        ></div>
        <!-- Gradient mobile (bas) -->
        <div
            class="absolute inset-0 bg-linear-to-t from-base-200/80 via-transparent to-transparent lg:hidden pointer-events-none"
        ></div>

        <!-- Badges haut gauche -->
        <div class="absolute top-4 left-4 flex flex-wrap gap-2">
            {#if event?.isVedette}
                <span
                    class="badge badge-primary gap-1.5 text-[10px] uppercase tracking-widest py-3 px-3 shadow-lg shadow-primary/30 font-bold"
                >
                    <Star size={9} fill="currentColor" />
                    Vedette
                </span>
            {/if}
            <span
                class="badge bg-base-100/80 backdrop-blur-md border border-primary/20 text-primary text-[10px] uppercase tracking-wider py-3 px-3 font-semibold"
            >
                {category}
            </span>
        </div>

        <!-- Lieu mobile (bas) -->
        <div
            class="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 lg:hidden text-base-content/80"
        >
            <MapPin size={12} class="text-primary/80 shrink-0" />
            <span class="text-xs truncate">{location}</span>
        </div>
    </figure>

    <!-- ── Contenu ───────────────────────────────────────────────────────────── -->
    <div class="card-body lg:w-[45%] p-6 lg:p-10 justify-between gap-0">
        <div>
            <!-- Étoiles -->
            {#if event?.rating}
                <div class="flex items-center gap-1 mb-4">
                    {#each Array(5) as _, i}
                        <Star
                            size={13}
                            class={i < Math.floor(event.rating ?? 0)
                                ? "text-warning fill-warning"
                                : "text-base-content/15"}
                        />
                    {/each}
                    <span class="text-xs text-base-content/35 ml-2">
                        {event.rating}
                        {#if event.reviewCount}
                            · {event.reviewCount} avis{/if}
                    </span>
                </div>
            {/if}

            <!-- Titre -->
            <h2
                class="font-bold text-base-content group-hover:text-primary transition-colors duration-300
               leading-tight mb-2 line-clamp-2"
                style="font-size: clamp(1.4rem, 3vw, 2.2rem)"
            >
                {event?.title}
            </h2>

            {#if event?.subtitle}
                <p class="text-base italic text-primary/60 mb-4 line-clamp-1">
                    {event.subtitle}
                </p>
            {/if}

            {#if event?.description}
                <p
                    class="text-sm text-base-content/45 leading-relaxed mb-5 line-clamp-3"
                >
                    {event.description}
                </p>
            {/if}

            <div class="border-t border-primary/10 my-5"></div>

            <!-- Grille meta -->
            <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
                <!-- Date -->
                <div class="flex items-start gap-2.5">
                    <div
                        class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
                    >
                        <Calendar size={13} class="text-primary" />
                    </div>
                    <div>
                        <div
                            class="text-[9px] uppercase tracking-wider text-base-content/25 mb-0.5 font-semibold"
                        >
                            Date
                        </div>
                        <div
                            class="text-xs text-base-content/65 font-medium leading-snug"
                        >
                            {date}{time ? ` · ${time}` : ""}
                        </div>
                    </div>
                </div>

                <!-- Lieu -->
                <div class="flex items-start gap-2.5">
                    <div
                        class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
                    >
                        <MapPin size={13} class="text-primary" />
                    </div>
                    <div>
                        <div
                            class="text-[9px] uppercase tracking-wider text-base-content/25 mb-0.5 font-semibold"
                        >
                            Lieu
                        </div>
                        <div
                            class="text-xs text-base-content/65 font-medium leading-snug line-clamp-2"
                        >
                            {location}
                        </div>
                    </div>
                </div>

                <!-- Capacité -->
                {#if event?.capacity}
                    <div class="flex items-start gap-2.5">
                        <div
                            class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
                        >
                            <Users size={13} class="text-primary" />
                        </div>
                        <div>
                            <div
                                class="text-[9px] uppercase tracking-wider text-base-content/25 mb-0.5 font-semibold"
                            >
                                Capacité
                            </div>
                            <div
                                class="text-xs text-base-content/65 font-medium"
                            >
                                {event.capacity.toLocaleString("fr-FR")} places
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Places restantes -->
                <div class="flex items-start gap-2.5">
                    <div
                        class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
                    >
                        <Ticket size={13} class="text-primary" />
                    </div>
                    <div>
                        <div
                            class="text-[9px] uppercase tracking-wider text-base-content/25 mb-0.5 font-semibold"
                        >
                            Places
                        </div>
                        <div
                            class="text-xs font-semibold {spotsLeft !== null &&
                            spotsLeft < 30
                                ? 'text-error'
                                : 'text-primary'}"
                        >
                            {#if spotsLeft !== null}
                                {spotsLeft} restante{spotsLeft > 1 ? "s" : ""}
                            {:else}
                                Disponible
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div
            class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2"
        >
            <div>
                <div
                    class="text-[9px] uppercase tracking-widest text-base-content/25 mb-1 font-semibold"
                >
                    {event?.isFree ? "Tarif" : "À partir de"}
                </div>
                <div
                    class="font-black text-primary leading-none"
                    style="font-size: clamp(1rem, 2vw, 1.5rem)"
                >
                    {price}
                </div>
            </div>

            <a
                href={`/event/booking/${event?.id}`}
                class="btn btn-primary rounded-2xl gap-2 px-8 flex-1 sm:flex-none
               text-xs uppercase tracking-widest font-bold
               shadow-lg shadow-primary/25 hover:shadow-primary/40
               hover:gap-3 transition-all duration-200 py-2"
            >
                Participer maintenant
                <ArrowRight size={14} />
            </a>
        </div>
    </div>
</div>
