<script>
  import {
    Calendar,
    Ticket,
    ArrowUpRight,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
  } from "lucide-svelte";
  import { fly } from "svelte/transition";
  import { apiUrl, imageUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";

  export let userId = null;

  let events = [];
  let loading = true;

  $: if (userId) loadEvents(userId);

  async function loadEvents(id) {
    loading = true;
    try {
      const res = await fetch(`${apiUrl}/events/organizer/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.status) {
        const all = json.data ?? [];
        const now = new Date();
        // Prochains publiés à venir
        events = all
          .filter(
            (e) => e.status === "PUBLISHED" && new Date(e.dateStart) > now,
          )
          .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
          .slice(0, 4);
      }
    } catch {
      toast.error("Erreur lors du chargement.");
    } finally {
      loading = false;
    }
  }

  function imgSrc(p) {
    if (!p) return null;
    return p.startsWith("http") ? p : `${imageUrl}/${p}`;
  }
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  function formatTime(t) {
    return t ? t.slice(0, 5) : "";
  }
  function daysUntil(iso) {
    const diff = new Date(iso) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    return `Dans ${days} jours`;
  }
  function getPrice(ev) {
    if (ev?.isFree) return "Gratuit";
    const prices = (ev?.tickets ?? [])
      .map((t) => Number(t.price))
      .filter((p) => !isNaN(p));
    if (!prices.length) return "—";
    const min = Math.min(...prices);
    return min === 0
      ? "Gratuit"
      : `${(min).toLocaleString("fr-FR")} FCFA`;
  }
</script>

<div class="space-y-8">
  <!-- ── Bienvenue ──────────────────────────────────────────────── -->
  <div
    class="card bg-linear-to-br from-primary/10 via-base-200 to-base-200 border border-primary/15 p-5 sm:p-6"
  >
    <p
      class="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-1"
    >
      Tableau de bord
    </p>
    <h2 class="font-bold text-base-content text-lg sm:text-xl mb-1">
      Bonjour 👋
    </h2>
    <p class="text-sm text-base-content/45 leading-relaxed max-w-lg">
      Gérez vos événements, suivez vos ventes et consultez vos transactions
      depuis cet espace.
    </p>
    <div class="flex flex-wrap gap-2 mt-4">
      <a
        href="/event"
        class="btn btn-soft btn-primary btn-sm rounded-full border border-base-300 hover:border-primary/30 text-xs uppercase tracking-wider"
      >
        Explorer
      </a>
    </div>
  </div>

  <!-- ── Prochains événements ────────────────────────────────────── -->
  <div>
    <div class="flex items-center justify-between mb-4">
      <p
        class="text-[10px] uppercase tracking-[0.25em] text-base-content/35 font-bold"
      >
        Prochains événements
      </p>
    </div>

    {#if loading}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each Array(4) as _}
          <div class="skeleton h-24 rounded-xl"></div>
        {/each}
      </div>
    {:else if events.length === 0}
      <div class="card bg-base-200 border border-base-300 p-8 text-center">
        <Calendar size={28} class="text-base-content/15 mx-auto mb-3" />
        <p class="text-sm text-base-content/30 mb-3">
          Aucun événement à venir publié.
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each events as ev, i (ev.id)}
          <div
            class="card bg-base-200 border border-base-300 hover:border-primary/25 transition-colors overflow-hidden"
            in:fly={{ y: 8, duration: 200, delay: i * 50 }}
          >
            <div class="flex items-stretch gap-0">
              <!-- Image -->
              <div
                class="w-20 sm:w-24 shrink-0 relative overflow-hidden bg-base-300"
              >
                {#if imgSrc(ev.coverImage)}
                  <img
                    src={imgSrc(ev.coverImage)}
                    alt={ev.title}
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                {:else}
                  <div
                    class="absolute inset-0 bg-primary/10 flex items-center justify-center"
                  >
                    <Calendar size={18} class="text-primary/30" />
                  </div>
                {/if}
              </div>
              <!-- Infos -->
              <div class="flex-1 p-3 min-w-0 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="font-semibold text-sm text-base-content truncate">
                      {ev.title}
                    </p>
                    <a
                      href={`/event/${ev.id}`}
                      class="text-base-content/20 hover:text-primary shrink-0"
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  </div>
                  <p
                    class="text-[11px] text-base-content/35 flex items-center gap-1 mb-0.5"
                  >
                    <Calendar size={9} class="text-primary/50 shrink-0" />
                    {formatDate(ev.dateStart)}
                    {formatTime(ev.timeStart)}
                  </p>
                  <p
                    class="text-[11px] text-base-content/30 flex items-center gap-1"
                  >
                    <MapPin size={9} class="text-primary/50 shrink-0" />
                    {ev.isOnline ? "En ligne" : (ev.city ?? "—")}
                  </p>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span
                    class="badge badge-success badge-xs text-[9px] font-bold uppercase"
                  >
                    {daysUntil(ev.dateStart)}
                  </span>
                  <span class="text-xs font-bold text-primary"
                    >{getPrice(ev)}</span
                  >
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
