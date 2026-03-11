<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import {
    Bell, Calendar, Camera, CheckCircle,
    LayoutDashboard, Mail, Plus, Settings,
    Wallet, Ticket, CalendarCheck, TrendingUp,
  } from "lucide-svelte";
  import { apiUrl, imageUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import OverviewTab     from "./OverviewTab.svelte";
  import EventsTab       from "./EventsTab.svelte";
  import TransactionsTab from "./TransactionsTab.svelte";
  import SettingsTab     from "./SettingsTab.svelte";

  let activeTab   = "overview";
  let user        = null;
  let userLoading = true;
  let stats       = { eventsCount: 0, balance: 0, ticketsCount: 0 };

  onMount(async () => {
    await fetchUser();
  });

  async function fetchUser() {
    userLoading = true;
    try {
      const res  = await fetch(`${apiUrl}/auth/profile`, { credentials: "include" });
      const json = await res.json();
      if (json.status) {
        user  = json.data;
        // Charger les stats organizer
        await fetchStats(user.id);
      } else toast.error(json.message);
    } catch { toast.error("Une erreur est survenue"); }
    finally   { userLoading = false; }
  }

  async function fetchStats(userId) {
    try {
      const res  = await fetch(`${apiUrl}/events/organizer/${userId}`, { credentials: "include" });
      const json = await res.json();
      if (json.status) {
        const events = json.data ?? [];
        const totalSold = events.reduce((s, ev) =>
          s + (ev.tickets ?? []).reduce((ts, t) => ts + (t.sold ?? 0), 0), 0);
        const totalRevenue = events.reduce((s, ev) =>
          s + (ev.tickets ?? []).reduce((ts, t) => ts + (t.sold ?? 0) * (t.price ?? 0), 0), 0);
        stats = {
          eventsCount:  events.filter(e => e.status === "PUBLISHED").length,
          balance:      totalRevenue,
          ticketsCount: totalSold,
        };
      }
    } catch {}
  }

  const TABS = [
    { id: "overview",     label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "events",       label: "Événements",     icon: CalendarCheck   },
    { id: "transactions", label: "Transactions",   icon: Wallet          },
    { id: "settings",     label: "Paramètres",     icon: Settings        },
  ];

  const DEFAULT_COVER  = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=70";
  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80";

  $: fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";
  $: joinDate = user
    ? `Membre depuis ${new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`
    : "";
  $: avatar = user?.image ?? DEFAULT_AVATAR;

  $: statCards = [
    { label: "Événements actifs", value: stats.eventsCount,             icon: CalendarCheck, suffix: ""       },
    { label: "Recettes totales",  value: formatPrice(stats.balance),    icon: TrendingUp,    suffix: ""       },
    { label: "Billets vendus",    value: stats.ticketsCount,            icon: Ticket,        suffix: ""       },
  ];

  function formatPrice(c) {
    if (!c) return "0 FCFA";
    return `${(c / 100).toLocaleString("fr-FR")} FCFA`;
  }
</script>

<!-- Loader global -->
{#if userLoading}
  <div class="min-h-screen bg-base-100 flex items-center justify-center">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

{:else if !user}
  <div class="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-3 p-4 text-center">
    <p class="font-bold text-base-content/40">Vous n'êtes pas connecté.</p>
    <a href="/auth/login" class="btn btn-primary btn-sm rounded-full text-xs uppercase tracking-wider">Se connecter</a>
  </div>

{:else}
  <Navbar />

  <div class="min-h-screen bg-base-100 pt-16">

    <!-- ── Cover ──────────────────────────────────────────────────── -->
    <div class="relative h-32 sm:h-48 lg:h-56 overflow-hidden">
      <img src={DEFAULT_COVER} alt="cover" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/40 to-transparent"></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- ── Profil header ──────────────────────────────────────── -->
      <div class="relative -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

        <div class="flex items-end gap-4">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-base-100 overflow-hidden bg-base-200 shadow-xl shadow-black/20">
              <img src={avatar} alt={fullName} class="object-cover w-full h-full" />
            </div>
            <button class="absolute -bottom-1 -right-1 btn btn-primary btn-circle btn-xs shadow">
              <Camera size={10} />
            </button>
          </div>

          <!-- Infos -->
          <div class="pb-1">
            <div class="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-base-content leading-tight">{fullName}</h1>
              <CheckCircle size={15} class="text-primary shrink-0" />
            </div>
            <p class="text-[11px] text-base-content/40 flex items-center gap-1 mb-0.5">
              <Mail size={9} class="text-primary/50 shrink-0" />
              <span class="truncate max-w-[200px] sm:max-w-none">{user?.email ?? "—"}</span>
            </p>
            <p class="text-[10px] text-base-content/25">{joinDate}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 sm:pb-1 flex-wrap">
          <button class="btn btn-ghost btn-sm btn-circle border border-base-300 hover:border-primary/30 text-base-content/35">
            <Bell size={14} />
          </button>
          <a href="/event/create" class="btn btn-primary btn-sm rounded-full gap-1.5 text-xs uppercase tracking-widest">
            <Plus size={12} /> Créer un événement
          </a>
        </div>
      </div>

      <!-- ── Stats cards ──────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {#each statCards as item, i}
          <div class="card bg-base-200 border border-base-300 hover:border-primary/25 transition-colors p-4 flex flex-row items-center gap-4"
               in:fly={{ y: 10, duration: 250, delay: i * 60 }}>
            <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
              <svelte:component this={item.icon} size={16} class="text-primary" />
            </div>
            <div class="min-w-0">
              <p class="font-bold text-primary text-xl leading-none truncate">{item.value}</p>
              <p class="text-[10px] uppercase tracking-wider text-base-content/30 mt-0.5">{item.label}</p>
            </div>
          </div>
        {/each}
      </div>

      <!-- ── Tabs ────────────────────────────────────────────────── -->
      <div class="flex items-center border-b border-base-300 overflow-x-auto pb-px -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
        {#each TABS as tab}
          <button
            on:click={() => (activeTab = tab.id)}
            class="flex items-center gap-1.5 px-3 sm:px-5 py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider
                   whitespace-nowrap border-b-2 -mb-px transition-colors duration-150 shrink-0
                   {activeTab === tab.id
                     ? 'border-primary text-primary'
                     : 'border-transparent text-base-content/30 hover:text-base-content/50'}"
          >
            <svelte:component this={tab.icon} size={13} />
            {tab.label}
          </button>
        {/each}
      </div>

      <!-- ── Contenu onglets ─────────────────────────────────────── -->
      <div class="pb-12">
        {#key activeTab}
          <div in:fly={{ y: 8, duration: 200 }} out:fade={{ duration: 100 }}>
            {#if activeTab === "overview"}
              <OverviewTab userId={user.id} />
            {:else if activeTab === "events"}
              <EventsTab userId={user.id} />
            {:else if activeTab === "transactions"}
              <TransactionsTab />
            {:else if activeTab === "settings"}
              <SettingsTab />
            {/if}
          </div>
        {/key}
      </div>

    </div>
  </div>
{/if}
