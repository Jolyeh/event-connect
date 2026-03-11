<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { X, Ticket, Users, Banknote } from "lucide-svelte";
  import { apiUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";

  export let event;
  const dispatch = createEventDispatcher();

  let loading = true;
  // Calcul depuis les données de l'event directement (tickets disponibles dans la réponse API)
  let stats = null;

  onMount(async () => {
    // On récupère l'event complet pour avoir les tickets avec sold
    try {
      const res = await fetch(`${apiUrl}/events/${event.id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.status) {
        const ev = json.data;
        const tickets = ev.tickets ?? [];
        const totalSold = tickets.reduce((s, t) => s + (t.sold ?? 0), 0);
        const totalRevenue = tickets.reduce(
          (s, t) => s + (t.sold ?? 0) * (t.price ?? 0),
          0,
        );
        stats = {
          participantCount: totalSold,
          totalTicketsSold: totalSold,
          totalRevenue,
          ticketBreakdown: tickets.map((t) => ({
            name: t.name,
            sold: t.sold ?? 0,
            quantity: t.quantity ?? 0,
            price: t.price ?? 0,
            revenue: (t.sold ?? 0) * (t.price ?? 0),
          })),
        };
      } else toast.error(json.message);
    } catch {
      toast.error("Impossible de charger les stats.");
    } finally {
      loading = false;
    }
  });

  function formatPrice(c) {
    if (!c) return "0 F";
    return `${(c / 100).toLocaleString("fr-FR")} F`;
  }
  function close() {
    dispatch("close");
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
</script>

<svelte:window on:keydown={onKey} />

<div
  class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
  on:click|self={close}
  role="dialog"
  aria-modal="true"
>
  <!-- Sheet sur mobile, modal centré sur desktop -->
  <div
    class="bg-base-100 border border-base-300 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl"
  >
    <!-- Handle mobile -->
    <div class="flex justify-center pt-3 pb-1 sm:hidden">
      <div class="w-10 h-1 rounded-full bg-base-300"></div>
    </div>

    <!-- Header -->
    <div
      class="flex items-center justify-between px-5 py-4 border-b border-base-300"
    >
      <div class="min-w-0">
        <p
          class="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-0.5"
        >
          Statistiques
        </p>
        <h2 class="font-bold text-sm text-base-content truncate">
          {event.title}
        </h2>
      </div>
      <button
        type="button"
        on:click={close}
        class="btn btn-ghost btn-sm btn-circle text-base-content/30 shrink-0"
      >
        <X size={16} />
      </button>
    </div>

    <!-- Contenu -->
    <div class="p-5 space-y-4">
      {#if loading}
        <div class="grid grid-cols-3 gap-3">
          {#each Array(3) as _}<div
              class="skeleton h-20 rounded-xl"
            ></div>{/each}
        </div>
      {:else if !stats}
        <p class="text-sm text-base-content/30 text-center py-6">
          Statistiques non disponibles.
        </p>
      {:else}
        <!-- KPIs -->
        <div class="grid grid-cols-3 gap-3">
          {#each [{ icon: Users, label: "Participants", value: stats.participantCount }, { icon: Ticket, label: "Billets vendus", value: stats.totalTicketsSold }, { icon: Banknote, label: "Recettes", value: formatPrice(stats.totalRevenue), sm: true }] as kpi}
            <div
              class="card bg-base-200 border border-base-300 p-3 text-center"
            >
              <div
                class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2"
              >
                <svelte:component
                  this={kpi.icon}
                  size={13}
                  class="text-primary"
                />
              </div>
              <p
                class="font-black text-primary {kpi.sm
                  ? 'text-xs'
                  : 'text-lg'} leading-tight"
              >
                {kpi.value}
              </p>
              <p
                class="text-[9px] uppercase tracking-wider text-base-content/25 mt-0.5 font-semibold"
              >
                {kpi.label}
              </p>
            </div>
          {/each}
        </div>

        <!-- Détail tickets -->
        {#if stats.ticketBreakdown?.length > 0}
          <div>
            <p
              class="text-[10px] uppercase tracking-[0.2em] text-base-content/25 font-bold mb-2"
            >
              Par type de billet
            </p>
            <div class="flex flex-col gap-2">
              {#each stats.ticketBreakdown as t}
                <div
                  class="flex items-center justify-between px-3 py-2.5 bg-base-200 border border-base-300 rounded-xl"
                >
                  <div>
                    <p class="text-xs font-semibold text-base-content">
                      {t.name}
                    </p>
                    <p class="text-[10px] text-base-content/30">
                      {t.sold} / {t.quantity} vendus
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-black text-primary">
                      {formatPrice(t.revenue)}
                    </p>
                    <p class="text-[10px] text-base-content/25">
                      {formatPrice(t.price)} / unité
                    </p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/if}
    </div>

    <div class="px-5 pb-5">
      <button
        type="button"
        on:click={close}
        class="btn btn-ghost border border-base-300 hover:border-primary/30 rounded-xl w-full text-xs uppercase tracking-wider"
      >
        Fermer
      </button>
    </div>
  </div>
</div>
