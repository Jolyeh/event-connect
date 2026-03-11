<script>
  import { fly } from "svelte/transition";
  import { Calendar, BarChart2, Eye, XCircle } from "lucide-svelte";
  import { apiUrl, imageUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";
  import EventStatsModal from "./EventStatsModal.svelte";

  export let userId = null;

  const STATUSES = [
    { key: "all",       label: "Tous"       },
    { key: "PENDING",   label: "En attente" },
    { key: "PUBLISHED", label: "Publié"     },
    { key: "CANCELLED", label: "Annulé"     },
    { key: "COMPLETED",  label: "Terminé"    },
  ];
  const STATUS_BADGE = {
    PENDING:   { label: "En attente", cls: "badge-warning"  },
    PUBLISHED: { label: "Publié",     cls: "badge-success"  },
    CANCELLED: { label: "Annulé",     cls: "badge-error"    },
    COMPLETED:  { label: "Terminé",    cls: "badge-neutral"  },
  };

  let activeStatus  = "all";
  let events        = [];
  let loading       = true;
  let selectedEvent = null;

  $: if (userId) loadEvents(userId);

  async function loadEvents(id) {
    loading = true;
    try {
      const res  = await fetch(`${apiUrl}/events/organizer/${id}`, { credentials: "include" });
      const json = await res.json();
      if (json.status) events = json.data ?? [];
      else toast.error(json.message);
    } catch { toast.error("Impossible de charger les événements."); }
    finally   { loading = false; }
  }

  $: filtered = activeStatus === "all"
    ? events
    : events.filter(e => e.status === activeStatus);

  function imgSrc(p) {
    if (!p) return null;
    return p.startsWith("http") ? p : `${imageUrl}/${p}`;
  }
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  }

  // Peut annuler seulement si pas CANCELLED ni COMPLETED
  function canCancel(ev) {
    return ev.status !== "CANCELLED" && ev.status !== "COMPLETED";
  }

  async function cancelEvent(ev) {
    if (!canCancel(ev)) return;
    if (!confirm(`Annuler "${ev.title}" ? Cette action est irréversible.`)) return;
    try {
      const res  = await fetch(`${apiUrl}/events/${ev.id}/status`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const json = await res.json();
      if (json.status) {
        events = events.map(e => e.id === ev.id ? { ...e, status: "CANCELLED" } : e);
        toast.success("Événement annulé.");
      } else toast.error(json.message);
    } catch { toast.error("Erreur lors de l'annulation."); }
  }
</script>

{#if selectedEvent}
  <EventStatsModal event={selectedEvent} on:close={() => (selectedEvent = null)} />
{/if}

<div class="space-y-4">

  <!-- Filtres -->
  <div class="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
    {#each STATUSES as s}
      <button type="button" on:click={() => (activeStatus = s.key)}
        class="btn btn-sm rounded-full text-xs uppercase tracking-wider shrink-0
               {activeStatus === s.key
                 ? 'btn-primary'
                 : 'btn-ghost border border-base-300 text-base-content/35 hover:border-primary/30'}">
        {s.label}
      </button>
    {/each}
  </div>

  <!-- Loader -->
  {#if loading}
    <div class="flex flex-col items-center justify-center py-16 gap-3">
      <span class="loading loading-spinner loading-md text-primary"></span>
      <p class="text-xs text-base-content/30 uppercase tracking-wider">Chargement des événements…</p>
    </div>

  {:else if filtered.length === 0}
    <div class="card bg-base-200 border border-base-300 p-10 text-center">
      <Calendar size={26} class="text-base-content/15 mx-auto mb-2" />
      <p class="text-sm text-base-content/30">Aucun événement dans cette catégorie.</p>
    </div>

  {:else}
    <div class="flex flex-col gap-2">
      {#each filtered as ev, i (ev.id)}
        <div class="card bg-base-200 border border-base-300 hover:border-primary/20 transition-colors"
             in:fly={{ y: 6, duration: 200, delay: i * 40 }}>
          <div class="flex items-center gap-3 p-3 sm:p-4">

            <!-- Image -->
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-base-300 shrink-0">
              {#if imgSrc(ev.coverImage)}
                <img src={imgSrc(ev.coverImage)} alt={ev.title} class="w-full h-full object-cover" />
              {:else}
                <div class="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Calendar size={16} class="text-primary/25" />
                </div>
              {/if}
            </div>

            <!-- Infos -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-0.5">
                <p class="font-semibold text-sm text-base-content truncate">{ev.title}</p>
                <span class="badge badge-xs {STATUS_BADGE[ev.status]?.cls ?? 'badge-neutral'} text-[9px] font-bold shrink-0">
                  {STATUS_BADGE[ev.status]?.label ?? ev.status}
                </span>
              </div>
              <p class="text-[11px] text-base-content/30 flex items-center gap-1">
                <Calendar size={9} class="text-primary/40 shrink-0" />
                {formatDate(ev.dateStart)}
                {#if ev.city}<span class="mx-1 text-base-content/15">·</span>{ev.city}{/if}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 shrink-0">
              <!-- Détails -->
              <a href={`/event/${ev.id}`}
                class="btn btn-ghost btn-xs rounded-lg border border-base-300 hover:border-primary/30
                       flex items-center gap-1 text-[10px] uppercase tracking-wider"
                title="Détails">
                <Eye size={12} />
                <span class="hidden sm:inline">Détails</span>
              </a>

              <!-- Stats -->
              <button type="button" on:click={() => (selectedEvent = ev)}
                class="btn btn-ghost btn-xs rounded-lg border border-base-300 hover:border-primary/30
                       flex items-center gap-1 text-[10px] uppercase tracking-wider"
                title="Statistiques">
                <BarChart2 size={12} />
                <span class="hidden sm:inline">Stats</span>
              </button>

              <!-- Annuler — désactivé si CANCELLED ou COMPLETED -->
              {#if canCancel(ev)}
                <button type="button" on:click={() => cancelEvent(ev)}
                  class="btn btn-ghost btn-xs rounded-lg border border-error/20 text-error/50
                         hover:border-error/40 hover:text-error flex items-center gap-1
                         text-[10px] uppercase tracking-wider"
                  title="Annuler l'événement">
                  <XCircle size={12} />
                  <span class="hidden sm:inline">Annuler</span>
                </button>
              {:else}
                <!-- Bouton grisé non cliquable -->
                <button type="button" disabled
                  class="btn btn-ghost btn-xs rounded-lg border border-base-300 text-base-content/15
                         flex items-center gap-1 text-[10px] uppercase tracking-wider cursor-not-allowed"
                  title="Action non disponible">
                  <XCircle size={12} />
                  <span class="hidden sm:inline">Annuler</span>
                </button>
              {/if}
            </div>

          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
