<script>
    import { createEventDispatcher, onMount } from "svelte";
    import {
        CheckCircle2,
        Shield,
        Ticket,
        Calendar,
        MapPin,
        Users,
        ArrowLeft,
        Minus,
        Plus,
        Wifi,
        AlertCircle,
    } from "lucide-svelte";
    import { page } from "$app/stores";
    import { imageUrl, apiUrl } from "$lib/utils/api_url";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";

    export let eventId = $page.params.id;
    export let preselectedTicket = $page.url.searchParams.get("ticketId") ?? "";
    export let preselectedQty = Number($page.url.searchParams.get("qty") ?? 1);

    const dispatch = createEventDispatcher();

    // ── State ────────────────────────────────────────────────────────────────
    /** @type {object|null} */
    let event = null;
    let loading = true;
    let error = "";

    let selection = {};
    let userName = "";
    let userEmail = "";
    let userPhone = "";
    let status = "idle"; // idle | loading | success | error
    let message = "";
    let reference = null;

    // ── Fetch event ──────────────────────────────────────────────────────────
    async function fetchEvent(id) {
        loading = true;
        error = "";
        try {
            const res = await fetch(`${apiUrl}/events/${id}`, {
                credentials: "include",
            });
            const json = await res.json();
            if (!json.status)
                throw new Error(json.message || "Événement introuvable");

            const raw = json.data;
            event = {
                id: raw.id,
                title: raw.title,
                image: raw.coverImage ? `${imageUrl}/${raw.coverImage}` : null,
                date: formatDate(raw.dateStart),
                time: raw.timeStart ?? "",
                location: raw.isOnline
                    ? "En ligne"
                    : [raw.venue, raw.city].filter(Boolean).join(", ") ||
                      "Lieu à confirmer",
                isOnline: raw.isOnline,
                isFree: raw.isFree,
                category: raw.category?.name ?? "",
                capacity: raw.capacity,
                tickets: (raw.tickets ?? []).map((t) => ({
                    id: t.id,
                    name: t.name,
                    description: t.description ?? null,
                    price: t.price, // centimes
                    available: (t.quantity ?? 0) - (t.sold ?? 0),
                })),
            };
        } catch (e) {
            error = e.message ?? "Une erreur est survenue";
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        fetchEvent(eventId);
    });

    // Pré-sélection après chargement
    $: if (event && preselectedTicket && Object.keys(selection).length === 0) {
        selection = { [preselectedTicket]: Math.max(1, preselectedQty || 1) };
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function formatDate(iso) {
        if (!iso) return "Date à confirmer";
        return new Date(iso).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function formatPrice(centimes) {
        if (!centimes || centimes === 0) return "Gratuit";
        return `${(centimes / 100).toLocaleString("fr-FR", { minimumFractionDigits: 0 })} FCFA`;
    }

    function updateQty(ticketId, value) {
        const clamped = Math.max(0, Math.min(8, value));
        selection = { ...selection, [ticketId]: clamped };
    }

    // ── Calculs réactifs ─────────────────────────────────────────────────────
    $: items = event
        ? event.tickets
              .map((ticket) => ({
                  ticket,
                  quantity: selection[ticket.id] || 0,
              }))
              .filter((item) => item.quantity > 0)
        : [];

    $: subtotal = items.reduce(
        (sum, item) => sum + item.ticket.price * item.quantity,
        0,
    );
    $: fee = Math.round(subtotal * 0.03);
    $: total = subtotal + fee;

    // ── Soumission ───────────────────────────────────────────────────────────
    async function handleSubmit() {
        if (!event || !items.length) {
            status = "error";
            message = "Sélectionnez au moins un billet.";
            return;
        }
        if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
            status = "error";
            message = "Renseignez votre nom, e-mail et téléphone.";
            return;
        }

        status = "loading";
        message = "";

        // TODO: remplacer par appel API réel
        await new Promise((r) => setTimeout(r, 700));

        reference = `EVB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        status = "success";

        dispatch("submit", {
            reference,
            eventId: event.id,
            userName,
            userEmail,
            userPhone,
            items: items.map((i) => ({
                ticketId: i.ticket.id,
                quantity: i.quantity,
            })),
        });
    }
</script>

<Navbar />
{#if loading}
    <div
        class="min-h-screen bg-base-100 pt-24 flex items-center justify-center"
    >
        <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
{:else if error}
    <div
        class="min-h-screen bg-base-100 pt-24 flex flex-col items-center justify-center gap-4 px-4"
    >
        <p class="text-base-content/40 text-sm text-center">{error}</p>
        <button
            on:click={() => fetchEvent(eventId)}
            class="btn btn-primary btn-sm rounded-full"
        >
            Réessayer
        </button>
    </div>
{:else if status === "success"}
    <div
        class="min-h-screen bg-base-100 pt-24 px-4 flex items-center justify-center"
    >
        <div
            class="max-w-lg w-full card bg-base-200 border border-primary/15 overflow-hidden"
        >
            <!-- Bande de couleur haut -->
            <div class="h-1.5 w-full bg-primary"></div>
            <div class="card-body items-center text-center py-14 gap-5">
                <div
                    class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                >
                    <CheckCircle2 size={32} class="text-primary" />
                </div>
                <div>
                    <h1 class="font-bold text-2xl text-base-content mb-2">
                        Participation confirmée !
                    </h1>
                    <p
                        class="text-sm text-base-content/45 leading-relaxed max-w-sm"
                    >
                        Votre participation a bien été enregistrée. Vous
                        recevrez une confirmation par e-mail.
                    </p>
                </div>
                {#if reference}
                    <div
                        class="bg-base-300 border border-primary/15 rounded-xl px-6 py-3"
                    >
                        <p
                            class="text-[10px] uppercase tracking-widest text-base-content/30 mb-1"
                        >
                            Référence
                        </p>
                        <p
                            class="font-mono font-bold text-primary text-lg tracking-wider"
                        >
                            {reference}
                        </p>
                    </div>
                {/if}
                <button
                    on:click={() => window.history.back()}
                    class="btn btn-ghost btn-sm rounded-full gap-2 text-xs uppercase tracking-wider mt-2"
                >
                    <ArrowLeft size={13} />
                    Retour à l'événement
                </button>
            </div>
        </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════════════
     FORMULAIRE
════════════════════════════════════════════════════════════════════════════ -->
{:else}
    <div class="min-h-screen bg-base-100 pt-[68px]">
        <!-- ── Mini header breadcrumb ──────────────────────────────────────── -->
        <div
            class="border-b border-base-300 bg-base-200/60 backdrop-blur-sm sticky top-[68px] z-10"
        >
            <div
                class="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-3"
            >
                <button
                    on:click={() => window.history.back()}
                    class="btn btn-ghost btn-xs rounded-full gap-1.5 text-base-content/40 hover:text-base-content px-2"
                >
                    <ArrowLeft size={13} />
                    <span
                        class="text-[11px] uppercase tracking-wider font-semibold"
                        >Retour</span
                    >
                </button>
                <span class="text-base-content/20 text-xs">·</span>
                <span
                    class="text-[11px] uppercase tracking-widest text-base-content/30 font-semibold"
                    >participation</span
                >
                {#if event}
                    <span class="text-base-content/20 text-xs">·</span>
                    <span
                        class="text-[11px] text-base-content/50 truncate max-w-[200px]"
                        >{event.title}</span
                    >
                {/if}
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                <!-- ── Colonne principale ─────────────────────────────────────── -->
                <div class="space-y-5">
                    <!-- Card event résumé -->
                    <div
                        class="card bg-base-200 border border-base-300 overflow-hidden group"
                    >
                        <div class="flex flex-col sm:flex-row">
                            <!-- Image -->
                            <div
                                class="relative sm:w-52 h-44 sm:h-auto shrink-0 overflow-hidden bg-base-300"
                            >
                                {#if event?.image}
                                    <img
                                        src={event.image}
                                        alt={event?.title}
                                        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div
                                        class="absolute inset-0 bg-linear-to-r from-transparent to-base-200/30 hidden sm:block"
                                    ></div>
                                {:else}
                                    <div
                                        class="w-full h-full flex items-center justify-center"
                                    >
                                        <span
                                            class="text-base-content/10 text-5xl font-black"
                                        >
                                            {event?.title
                                                ?.slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                {/if}
                                <!-- Catégorie badge -->
                                {#if event?.category}
                                    <div class="absolute top-3 left-3">
                                        <span
                                            class="badge badge-primary text-[9px] uppercase tracking-widest font-bold py-2 px-2.5"
                                        >
                                            {event.category}
                                        </span>
                                    </div>
                                {/if}
                            </div>

                            <div class="card-body p-5 sm:p-6 justify-center">
                                <p
                                    class="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-1"
                                >
                                    participation en cours
                                </p>
                                <h1
                                    class="font-bold text-xl text-base-content leading-snug mb-3"
                                >
                                    {event?.title}
                                </h1>
                                <!-- Meta ligne -->
                                <div class="flex flex-wrap gap-x-4 gap-y-1.5">
                                    <div
                                        class="flex items-center gap-1.5 text-xs text-base-content/50"
                                    >
                                        <Calendar
                                            size={12}
                                            class="text-primary/70 shrink-0"
                                        />
                                        <span
                                            >{event?.date}{event?.time
                                                ? ` · ${event.time}`
                                                : ""}</span
                                        >
                                    </div>
                                    <div
                                        class="flex items-center gap-1.5 text-xs text-base-content/50"
                                    >
                                        <svelte:component
                                            this={event?.isOnline
                                                ? Wifi
                                                : MapPin}
                                            size={12}
                                            class="text-primary/70 shrink-0"
                                        />
                                        <span>{event?.location}</span>
                                    </div>
                                    {#if event?.capacity}
                                        <div
                                            class="flex items-center gap-1.5 text-xs text-base-content/50"
                                        >
                                            <Users
                                                size={12}
                                                class="text-primary/70 shrink-0"
                                            />
                                            <span>{event.capacity} places</span>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card billets -->
                    <div class="card bg-base-200 border border-base-300">
                        <div class="card-body p-6 gap-5">
                            <div>
                                <p
                                    class="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-1"
                                >
                                    Étape 1
                                </p>
                                <h2 class="font-bold text-lg text-base-content">
                                    Choisissez vos billets
                                </h2>
                            </div>

                            {#if event?.isFree}
                                <div
                                    class="flex items-center gap-3 p-4 bg-primary/8 border border-primary/20 rounded-xl"
                                >
                                    <Ticket
                                        size={18}
                                        class="text-primary shrink-0"
                                    />
                                    <div>
                                        <p
                                            class="text-sm font-semibold text-primary"
                                        >
                                            Événement gratuit
                                        </p>
                                        <p
                                            class="text-xs text-base-content/40 mt-0.5"
                                        >
                                            Aucun billet requis — accès libre
                                        </p>
                                    </div>
                                </div>
                            {:else if event?.tickets?.length === 0}
                                <p class="text-sm text-base-content/35 italic">
                                    Aucun billet disponible pour le moment.
                                </p>
                            {:else}
                                <div class="flex flex-col gap-3">
                                    {#each event?.tickets ?? [] as ticket}
                                        {@const qty = selection[ticket.id] || 0}
                                        <div
                                            class="flex items-center justify-between gap-4 p-4 rounded-2xl
                                                    bg-base-300/60 border border-base-300
                                                    hover:border-primary/25 transition-colors duration-200"
                                            class:border-primary={qty > 0}
                                            class:bg-primary={false}
                                        >
                                            <div class="min-w-0">
                                                <p
                                                    class="font-semibold text-sm text-base-content leading-snug"
                                                >
                                                    {ticket.name}
                                                </p>
                                                {#if ticket.description}
                                                    <p
                                                        class="text-xs text-base-content/40 mt-0.5 line-clamp-1"
                                                    >
                                                        {ticket.description}
                                                    </p>
                                                {:else if ticket.available}
                                                    <p
                                                        class="text-xs text-base-content/35 mt-0.5"
                                                    >
                                                        {ticket.available} disponibles
                                                    </p>
                                                {/if}
                                                <p
                                                    class="text-sm font-bold text-primary mt-1.5"
                                                >
                                                    {formatPrice(ticket.price)}
                                                </p>
                                            </div>

                                            <!-- Compteur quantité -->
                                            <div
                                                class="flex items-center gap-2 shrink-0"
                                            >
                                                <button
                                                    type="button"
                                                    on:click={() =>
                                                        updateQty(
                                                            ticket.id,
                                                            qty - 1,
                                                        )}
                                                    class="btn btn-circle btn-sm bg-base-200 border border-base-300 hover:border-primary/40"
                                                    disabled={qty === 0}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span
                                                    class="w-7 text-center font-black text-base-content text-sm"
                                                >
                                                    {qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    on:click={() =>
                                                        updateQty(
                                                            ticket.id,
                                                            qty + 1,
                                                        )}
                                                    class="btn btn-circle btn-sm bg-base-200 border border-base-300 hover:border-primary/40"
                                                    disabled={qty >= 8}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Card infos personnelles -->
                    <div class="card bg-base-200 border border-base-300">
                        <div class="card-body p-6 gap-5">
                            <div>
                                <p
                                    class="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-1"
                                >
                                    Étape 2
                                </p>
                                <h2 class="font-bold text-lg text-base-content">
                                    Vos informations
                                </h2>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="sm:col-span-2">
                                    <label for="" class="label pb-1">
                                        <span
                                            class="label-text text-[10px] uppercase tracking-widest text-base-content/35 font-semibold"
                                        >
                                            Nom complet
                                        </span>
                                    </label>
                                    <input
                                        bind:value={userName}
                                        type="text"
                                        placeholder="Jean Dupont"
                                        class="input input-bordered w-full bg-base-300 border-base-300
                                               focus:border-primary/50 rounded-xl h-11 text-sm"
                                    />
                                </div>
                                <div>
                                    <label for="" class="label pb-1">
                                        <span
                                            class="label-text text-[10px] uppercase tracking-widest text-base-content/35 font-semibold"
                                        >
                                            E-mail
                                        </span>
                                    </label>
                                    <input
                                        bind:value={userEmail}
                                        type="email"
                                        placeholder="jean@exemple.com"
                                        class="input input-bordered w-full bg-base-300 border-base-300
                                               focus:border-primary/50 rounded-xl h-11 text-sm"
                                    />
                                </div>
                                <div>
                                    <label for="" class="label pb-1">
                                        <span
                                            class="label-text text-[10px] uppercase tracking-widest text-base-content/35 font-semibold"
                                        >
                                            Téléphone
                                        </span>
                                    </label>
                                    <input
                                        bind:value={userPhone}
                                        type="tel"
                                        placeholder="+229 97 00 00 00"
                                        class="input input-bordered w-full bg-base-300 border-base-300
                                               focus:border-primary/50 rounded-xl h-11 text-sm"
                                    />
                                </div>
                            </div>

                            {#if status === "error"}
                                <div
                                    class="mb-4 flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3"
                                >
                                    <AlertCircle size={15} class="shrink-0" />
                                    <span class="text-xs font-medium"
                                        >{message}</span
                                    >
                                </div>
                                
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- ── Récapitulatif sticky ─────────────────────────────────── -->
                <aside class="h-fit sticky top-28">
                    <div
                        class="card bg-base-200 border border-primary/15 overflow-hidden"
                    >
                        <!-- Bande top -->
                        <div class="h-1 w-full bg-primary"></div>

                        <div class="card-body p-6 gap-5">
                            <div class="flex items-center gap-2">
                                <Ticket size={16} class="text-primary" />
                                <h2 class="font-bold text-lg text-base-content">
                                    Récapitulatif
                                </h2>
                            </div>

                            <!-- Lignes billets -->
                            <div class="space-y-2 min-h-[60px]">
                                {#if items.length > 0}
                                    {#each items as item}
                                        <div
                                            class="flex justify-between items-start gap-2 text-sm"
                                        >
                                            <span
                                                class="text-base-content/60 leading-snug"
                                            >
                                                {item.ticket.name}
                                                <span
                                                    class="text-base-content/35"
                                                >
                                                    × {item.quantity}</span
                                                >
                                            </span>
                                            <span
                                                class="font-semibold text-base-content shrink-0"
                                            >
                                                {formatPrice(
                                                    item.ticket.price *
                                                        item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p
                                        class="text-sm text-base-content/30 italic text-center py-2"
                                    >
                                        Aucun billet sélectionné.
                                    </p>
                                {/if}
                            </div>

                            <div
                                class="border-t border-base-300 pt-4 space-y-2"
                            >
                                <div
                                    class="flex justify-between text-xs text-base-content/40"
                                >
                                    <span>Sous-total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div
                                    class="flex justify-between text-xs text-base-content/40"
                                >
                                    <span>Frais de service (3%)</span>
                                    <span>{formatPrice(fee)}</span>
                                </div>
                                <div
                                    class="flex justify-between items-baseline pt-2 border-t border-base-300"
                                >
                                    <span
                                        class="font-bold text-base-content text-sm"
                                        >Total</span
                                    >
                                    <span
                                        class="font-black text-primary text-xl leading-none"
                                    >
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                on:click={handleSubmit}
                                disabled={status === "loading" ||
                                    (items.length === 0 && !event?.isFree)}
                                class="btn btn-primary w-full rounded-xl h-12 gap-2 text-xs uppercase tracking-widest font-bold
                                       shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-shadow duration-200"
                            >
                                {#if status === "loading"}
                                    <span
                                        class="loading loading-spinner loading-xs"
                                    ></span>
                                    Traitement…
                                {:else}
                                    <Shield size={14} />
                                    Confirmer la participation
                                {/if}
                            </button>

                            <div
                                class="flex items-center justify-center gap-1.5 text-[10px] text-base-content/25 font-medium"
                            >
                                <Shield size={11} class="text-primary/40" />
                                Paiement sécurisé · Mobile Money
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
{/if}
<Footer />
