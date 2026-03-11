<script>
  import { imageUrl } from "$lib/utils/api_url";
  import {
    CalendarDays,
    MapPin,
    ArrowUpRight,
    Wifi,
    Image,
  } from "lucide-svelte";

  export let event;

  function formatDate(date) {
    if (!date) return "Date non définie";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function getLocation(event) {
    if (event?.isOnline) return "En ligne";
    return (
      [event?.venue, event?.city].filter(Boolean).join(" · ") ||
      "Lieu à confirmer"
    );
  }

  function getLowestPrice(event) {
    if (event?.isFree) return "Gratuit";
    if (!event?.tickets || event.tickets.length === 0) return "Prix à venir";
    const prices = event.tickets
      .map((t) => Number(t.price))
      .filter((p) => !Number.isNaN(p));
    if (prices.length === 0) return "Prix à venir";
    return `${Math.min(...prices).toLocaleString("fr-FR")} FCFA`;
  }

  $: cover = event?.coverImage ? `${imageUrl}/${event.coverImage}` : "";
  $: categoryName = event?.category?.name || "Événement";
  $: formattedDate = formatDate(event?.dateStart);
  $: location = getLocation(event);
  $: priceLabel = getLowestPrice(event);
  $: isFree = event?.isFree;
  $: isOnline = event?.isOnline;
</script>

<article
  class="card bg-base-200 border border-base-300 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full group"
>
  <!-- Image -->
  <a
    href={`/event/${event?.id}`}
    class="relative block h-52 overflow-hidden"
    tabindex="-1"
  >
    {#if cover}
      <img
        src={cover}
        alt={event?.title}
        class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    {:else}
      <div class="h-full w-full bg-base-300 flex items-center justify-center">
        <Image size={32} class="text-base-content/20" />
      </div>
    {/if}

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-linear-to-t from-base-200/80 via-transparent to-transparent"
    ></div>

    <!-- Catégorie -->
    <div class="absolute top-3 left-3">
      <span
        class="badge badge-primary badge-sm font-semibold uppercase tracking-widest text-[9px] shadow-lg"
      >
        {categoryName}
      </span>
    </div>

    <!-- Prix badge -->
    <div class="absolute bottom-3 right-3">
      {#if isFree}
        <div
          class="bg-base-100/85 backdrop-blur-sm border border-primary/30 rounded-xl px-3 py-1.5 shadow-lg"
        >
          <p class="text-primary font-black text-sm leading-none">
            {priceLabel}
          </p>
        </div>
      {:else}
        <div
          class="bg-base-100/85 backdrop-blur-sm border border-primary/30 rounded-xl px-3 py-1.5 shadow-lg"
        >
          <p
            class="text-[8px] uppercase tracking-widest text-base-content/40 font-semibold leading-none mb-0.5"
          >
            Dès
          </p>
          <p class="text-primary font-black text-sm leading-none">
            {priceLabel}
          </p>
        </div>
      {/if}
    </div>
  </a>

  <!-- Body -->
  <div class="card-body p-4 gap-3">
    <!-- Titre -->
    <a
      href={`/event/${event?.id}`}
      class="hover:text-primary transition-colors duration-200"
    >
      <h3
        class="font-bold text-base-content text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200"
      >
        {event?.title}
      </h3>
    </a>

    <!-- Description -->
    <p class="text-xs text-base-content/50 line-clamp-2 leading-relaxed">
      {event?.description}
    </p>

    <!-- Meta infos -->
    <div
      class="flex flex-col gap-1.5 py-2.5 px-3 bg-base-300/60 rounded-xl border border-base-300"
    >
      <div class="flex items-center gap-2 text-[11px] text-base-content/60">
        <CalendarDays size={12} class="text-primary shrink-0" />
        <span class="font-medium"
          >{formattedDate}{event?.timeStart
            ? ` · ${event.timeStart}`
            : ""}</span
        >
      </div>
      <div class="flex items-center gap-2 text-[11px] text-base-content/60">
        <svelte:component
          this={isOnline ? Wifi : MapPin}
          size={12}
          class="text-primary shrink-0"
        />
        <span class="truncate font-medium">{location}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-auto flex items-center justify-between gap-2 pt-1">
      <div>
        <p
          class="text-[9px] uppercase tracking-widest text-base-content/30 font-semibold mb-0.5"
        >
          {isFree ? "Tarif" : "À partir de"}
        </p>
        <p class="text-primary font-black text-sm leading-none">{priceLabel}</p>
      </div>

      <a
        href={`/event/${event?.id}`}
        class="btn btn-primary btn-sm rounded-xl gap-1.5 text-[10px] uppercase tracking-wider font-bold px-4 group/btn"
      >
        Détails
        <ArrowUpRight
          size={13}
          class="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
        />
      </a>
    </div>
  </div>
</article>
