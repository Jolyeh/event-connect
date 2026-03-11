<script>
  import {
    AlertCircle,
    Calendar,
    Check,
    Clock,
    Heart,
    Image,
    MapPin,
    Share2,
    Star,
    StarIcon,
    Users,
    Wifi,
  } from "lucide-svelte";
  import EventOrganizer from "./EventOrganizer.svelte";
  import EventRelated from "./EventRelated.svelte";
  import EventTicketPanel from "./EventTicketPanel.svelte";
  import { apiUrl, imageUrl } from "$lib/utils/api_url";
  import { page } from "$app/stores";
  import EventDetailShimmer from "../EventDetailShimmer.svelte";

  // ── Props ────────────────────────────────────────────────────────────────────
  // eventId doit être passé par le parent (ex: SvelteKit $page.params.id)

  export let bookingBaseUrl = "booking";

  const API_URL = apiUrl;
  const IMG_URL = imageUrl;

  // ── State ────────────────────────────────────────────────────────────────────
  /** @type {object|null} */
  let eventId = $page.params.id;
  let event = null;
  let relatedEvents = [];
  let organizerRecentEvents = [];
  let loading = true;
  let error = "";

  let copy = false;
  let activeTab = "description";

  // ── Helpers de formatage ─────────────────────────────────────────────────────

  /** Formate une date ISO en "12 mars 2026" */
  function formatDate(dateStart, dateEnd) {
    if (!dateStart) return "Date à confirmer";
    try {
      const s = new Date(dateStart);
      const e = dateEnd ? new Date(dateEnd) : null;

      if (!e) {
        return s.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      const sameYear = s.getFullYear() === e.getFullYear();
      const sameMonth = sameYear && s.getMonth() === e.getMonth();

      if (sameMonth) {
        // ex: "3 au 5 janvier 2025"
        return `${s.getDate()} au ${e.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
      }

      if (sameYear) {
        // ex: "28 janvier au 3 février 2025"
        const start = s.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
        });
        const end = e.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        return `${start} au ${end}`;
      }

      // Années différentes : affichage complet des deux
      const start = s.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const end = e.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return `${start} au ${end}`;
    } catch {
      return "Date invalide";
    }
  }

  /** Construit l'heure de début → fin si disponible */
  function formatTime(timeStart, timeEnd) {
    if (!timeStart) return "À confirmer";
    return timeEnd ? `${timeStart} – ${timeEnd}` : timeStart;
  }

  /** URL complète pour une image uploadée */
  function imgSrc(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${IMG_URL}/${path}`;
  }

  /** Résout le prix minimum des tickets (centimes → euros) */
  function resolvePrice(isFree, tickets) {
    if (isFree || !tickets?.length) return 0;
    const prices = tickets
      .map((t) => t.price)
      .filter((p) => typeof p === "number");
    return prices.length ? Math.min(...prices) / 100 : 0;
  }

  /** Places restantes = capacity - somme des sold */
  function resolveSpotsLeft(capacity, tickets) {
    if (!capacity) return null; // null = illimité, affiché "Ouvert"
    const sold = tickets?.reduce((acc, t) => acc + (t.sold ?? 0), 0) ?? 0;
    return Math.max(0, capacity - sold);
  }

  // ── Fetch principal ──────────────────────────────────────────────────────────
  async function fetchEvent(id) {
    loading = true;
    error = "";
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!json.status)
        throw new Error(json.message || "Événement introuvable");

      const raw = json.data;

      // Normalisation : on adapte les champs API → champs attendus par les composants
      event = {
        // Champs bruts
        id: raw.id,
        title: raw.title,
        description: raw.description,
        status: raw.status,
        isVedette: raw.isVedette,
        isOnline: raw.isOnline,
        isFree: raw.isFree,
        capacity: raw.capacity,
        venue: raw.venue,
        city: raw.city,
        address: raw.address,
        onlineUrl: raw.onlineUrl,
        gallery: raw.gallery ?? [],
        saleStart: raw.saleStart,
        saleEnd: raw.saleEnd,
        ageRestriction: raw.ageRestriction,
        contactEmail: raw.contactEmail,
        website: raw.website,
        updatedAt: raw.updatedAt,

        // Normalisés
        image: imgSrc(raw.coverImage),
        date: formatDate(raw.dateStart, raw.dateEnd),
        dateStart: raw.dateStart,
        dateEnd: raw.dateEnd,
        time: formatTime(raw.timeStart, raw.timeEnd),
        timeStart: raw.timeStart,
        location: raw.isOnline
          ? "En ligne"
          : raw.venue || raw.city || "À confirmer",
        category: raw.category?.name ?? "",
        categorySlug: raw.category?.slug ?? "",
        tags: raw.tags?.map((t) => t.name) ?? [],
        price: resolvePrice(raw.isFree, raw.tickets),
        spotsLeft: resolveSpotsLeft(raw.capacity, raw.tickets),

        // Tickets : prix en centimes → euros pour l'affichage
        tickets:
          raw.tickets?.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description ?? null,
            price: t.price,
            available: (t.quantity ?? 0) - (t.sold ?? 0),
          })) ?? [],

        // Organisateur normalisé
        organizer: raw.organizer
          ? {
              id: raw.organizer.id,
              name: `${raw.organizer.firstName} ${raw.organizer.lastName}`.trim(),
              email: raw.organizer.email,
              avatar: imgSrc(raw.organizer.image),
              verified: false, // non disponible dans l'API actuelle
              eventCount: "—", // chargé séparément si besoin
              rating: "—",
            }
          : null,

        // Champs UI non disponibles dans l'API → valeurs par défaut
        subtitle: null,
        rating: null,
        reviewCount: 0,
        program: [],
      };

      // Fetches parallèles : événements liés + events récents de l'organisateur
      await Promise.all([
        fetchRelated(raw.category?.slug),
        fetchOrganizerEvents(raw.organizer?.id, raw.id),
      ]);
    } catch (e) {
      console.error("[FETCH_EVENT]", e);
      error = e.message ?? "Une erreur est survenue";
    } finally {
      loading = false;
    }
  }

  // ── Events liés (même catégorie) ────────────────────────────────────────────
  async function fetchRelated(categorySlug) {
    if (!categorySlug) return;
    try {
      const res = await fetch(`${API_URL}/events/category/${categorySlug}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!json.status) return;

      relatedEvents = (json.data ?? [])
        .filter((e) => e.id !== eventId)
        .slice(0, 2);
    } catch (e) {
      console.error("[FETCH_RELATED]", e);
    }
  }

  // ── Derniers events de l'organisateur ───────────────────────────────────────
  async function fetchOrganizerEvents(organizerId, currentId) {
    if (!organizerId) return;
    try {
      const res = await fetch(`${API_URL}/events/organizer/${organizerId}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!json.status) return;

      organizerRecentEvents = (json.data ?? [])
        .filter((e) => e.id !== currentId && e.status === "COMPLETED")
        .slice(0, 3)
        .map((e) => ({
          id: e.id,
          title: e.title,
          date: formatDate(e.dateStart, e.dateEnd),
          image: imgSrc(e.coverImage),
        }));
    } catch (e) {
      console.error("[FETCH_ORGANIZER_EVENTS]", e);
    }
  }

  // ── Share ────────────────────────────────────────────────────────────────────
  async function shareEvent() {
    if (!event || typeof window === "undefined") return;
    const shareData = {
      title: event.title,
      text: event.subtitle || event.title,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      copy = true;
      setTimeout(() => {
        copy = false;
      }, 3000);
    }
  }

  // ── Déclenchement au changement d'eventId ───────────────────────────────────
  $: if (eventId) fetchEvent(eventId);

  $: {
    if ($page.params.id !== eventId) {
      eventId = $page.params.id;
      fetchEvent(eventId);
    }
  }

  $: metaItems = event
    ? [
        { icon: Calendar, label: "Date", value: event.date },
        { icon: Clock, label: "Heure", value: event.time },
        { icon: MapPin, label: "Lieu", value: event.location },
        {
          icon: event.isOnline ? Wifi : Users,
          label: "Capacité",
          value: event.isOnline
            ? "En ligne"
            : event.spotsLeft !== null
              ? `${event.spotsLeft} places`
              : "Ouvert",
        },
      ]
    : [];
</script>

<!-- ── Loading ─────────────────────────────────────────────────────────────── -->
{#if loading}
  <EventDetailShimmer />
  <!-- ── Erreur ──────────────────────────────────────────────────────────────── -->
{:else if error}
  <div
    class="min-h-screen bg-base-100 pt-24 flex flex-col items-center justify-center gap-4"
  >
    <p class="text-base-content/50 text-sm">{error}</p>
    <button
      type="button"
      on:click={() => fetchEvent(eventId)}
      class="btn btn-primary btn-sm rounded-full"
    >
      Réessayer
    </button>
  </div>

  <!-- ── Contenu ─────────────────────────────────────────────────────────────── -->
{:else if event}
  <div class="min-h-screen bg-base-100 pt-16">
    <!-- Hero image -->
    <div class="relative h-[50vh] sm:h-[55vh] lg:h-[65vh] overflow-hidden">
      {#if event.image}
        <img
          src={event.image}
          alt={event.title}
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="w-full h-full bg-base-300 flex items-center justify-center">
          <span class="text-base-content/15 text-6xl"><Image /></span>
        </div>
      {/if}
      <div
        class="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/30 to-transparent"
      ></div>

      <!-- Actions -->
      <div
        class="absolute top-6 left-0 right-0 flex items-center justify-end px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div class="flex items-center gap-2">
          <button
            type="button"
            on:click={shareEvent}
            class="btn btn-circle btn-sm bg-base-100/70 backdrop-blur-md border-primary/15"
          >
            {#if copy}
              <Check size={15} class="text-primary" />
            {:else}
              <Share2 size={15} class="text-base-content/60" />
            {/if}
          </button>
        </div>
      </div>

      <!-- Catégorie badge -->
      <div class="absolute bottom-8 left-4 sm:left-8">
        <span
          class="badge bg-base-100/80 backdrop-blur-md border-primary/25 text-primary text-[10px] uppercase tracking-widest py-2.5 px-3 font-semibold"
        >
          {event.category}
        </span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-10">
        <!-- ── Colonne principale ─────────────────────────────────────────── -->
        <div class="flex-1 min-w-0">
          <!-- Titre & meta -->
          <div class="mb-6">
            <h1
              class="font-display font-bold text-base-content leading-tight mb-2"
              style="font-size: clamp(1.8rem,5vw,3rem)"
            >
              {event.title}
            </h1>
            {#if event.subtitle}
              <p class="font-display text-xl italic text-primary/70 mb-4">
                {event.subtitle}
              </p>
            {/if}

            <div class="flex flex-wrap items-center gap-4 mb-6">
              {#if event.rating !== null}
                <div class="flex items-center gap-1.5">
                  {#each Array(5) as _, index}
                    <Star
                      size={14}
                      class={index < Math.floor(event.rating ?? 0)
                        ? "text-warning fill-warning"
                        : "text-base-content/15"}
                    />
                  {/each}
                  <span class="text-sm font-semibold text-base-content ml-1"
                    >{event.rating ?? "—"}</span
                  >
                  <span class="text-sm text-base-content/35"
                    >({event.reviewCount ?? 0} avis)</span
                  >
                </div>
              {/if}

              {#if event.spotsLeft !== null && event.spotsLeft !== undefined}
                <div class="flex items-center gap-1 text-primary text-sm">
                  <span class="w-2 h-2 rounded-full bg-primary"></span>
                  <span class="font-medium"
                    >{event.spotsLeft} places restantes</span
                  >
                </div>
              {/if}

              {#if event.isVedette}
                <span
                  class="badge badge-warning badge-outline text-[10px] uppercase tracking-wider"
                >
                  <StarIcon size={12} /> Événement vedette
                </span>
              {/if}
            </div>
          </div>

          <!-- Grille meta -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {#each metaItems as item}
              <div
                class="flex flex-col gap-1.5 p-3 bg-base-200 border border-primary/8 rounded-xl"
              >
                <div class="flex items-center gap-1.5">
                  <svelte:component
                    this={item.icon}
                    size={12}
                    class="text-primary/60"
                  />
                  <span
                    class="text-[9px] uppercase tracking-widest text-base-content/30"
                    >{item.label}</span
                  >
                </div>
                <span
                  class="text-xs font-semibold text-base-content leading-snug"
                  >{item.value}</span
                >
              </div>
            {/each}
          </div>

          <!-- Onglets -->
          <div
            class="flex items-center gap-1 border-b border-primary/10 mb-6 overflow-auto"
          >
            {#each ["description", "program", "venue"] as tab}
              <button
                type="button"
                on:click={() => (activeTab = tab)}
                class={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-base-content/35"}`}
              >
                {tab === "description"
                  ? "Description"
                  : tab === "program"
                    ? "Programme"
                    : "Lieu"}
              </button>
            {/each}
          </div>

          <!-- Contenu onglets -->
          <div class="mb-8">
            {#if activeTab === "description"}
              <div
                class="text-sm text-base-content/60 leading-relaxed space-y-4"
              >
                {#each (event.description || "").split("\n\n") as paragraph}
                  <p>{paragraph}</p>
                {/each}
                {#if event.tags.length > 0}
                  <div class="flex flex-wrap gap-1.5 pt-2">
                    {#each event.tags as tag}
                      <span
                        class="badge badge-outline border-primary/15 text-base-content/35 text-[10px] uppercase tracking-wider py-2 px-3"
                        >#{tag}</span
                      >
                    {/each}
                  </div>
                {/if}
                {#if event.ageRestriction}
                  <p class="text-warning/70 mt-2 flex gap-2 items-center">
                    <AlertCircle /> Réservé aux {event.ageRestriction}
                  </p>
                {/if}
              </div>
            {/if}

            {#if activeTab === "program"}
              {#if event.program?.length > 0}
                <div class="flex flex-col gap-3">
                  {#each event.program as item}
                    <div
                      class="flex items-start gap-4 p-3 bg-base-200 rounded-xl border border-primary/8"
                    >
                      <div class="text-primary font-semibold text-sm min-w-16">
                        {item.time}
                      </div>
                      <div class="text-sm text-base-content/60">
                        {item.item}
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-sm text-base-content/30 italic">
                  Programme non disponible.
                </p>
              {/if}
            {/if}

            {#if activeTab === "venue"}
              <div class="space-y-4 text-sm text-base-content/60">
                <div class="p-4 bg-base-200 rounded-xl border border-primary/8">
                  <p class="font-semibold text-base-content mb-1">
                    {event.location}
                  </p>
                  {#if event.address}
                    <p>{event.address}</p>
                  {/if}
                  {#if event.isOnline && event.onlineUrl}
                    <a
                      href={event.onlineUrl}
                      target="_blank"
                      rel="noopener"
                      class="text-primary underline break-all mt-1 block"
                    >
                      {event.onlineUrl}
                    </a>
                  {:else if event.city}
                    <p class="mt-1 text-base-content/45">
                      Ville : {event.city}
                    </p>
                  {/if}
                  {#if event.contactEmail}
                    <p class="mt-2 text-base-content/40 text-xs">
                      Contact : {event.contactEmail}
                    </p>
                  {/if}
                  {#if event.website}
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener"
                      class="text-primary text-xs underline mt-1 block"
                    >
                      {event.website}
                    </a>
                  {/if}
                </div>

                <!-- Galerie -->
                {#if event.gallery?.length > 0}
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {#each event.gallery as img}
                      <img
                        src={imgSrc(img)}
                        alt=""
                        class="rounded-xl object-cover aspect-square w-full"
                      />
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Organisateur -->
          {#if event.organizer}
            <div class="mt-10">
              <EventOrganizer
                organizer={event.organizer}
                recentEvents={organizerRecentEvents}
              />
            </div>
          {/if}

          <!-- Events liés -->
          <EventRelated events={relatedEvents} />
        </div>

        <!-- ── Panneau billetterie ─────────────────────────────────────────── -->
        <div class="w-full lg:w-[380px] shrink-0">
          <EventTicketPanel
            eventId={event.id}
            tickets={event.tickets}
            isFree={event.isFree}
            spotsLeft={event.spotsLeft ?? 0}
            date={event.date}
            time={event.time}
            {bookingBaseUrl}
          />
        </div>
      </div>
    </div>
  </div>
{/if}
