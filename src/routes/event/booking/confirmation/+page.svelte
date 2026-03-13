<script>
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import { apiUrl } from "$lib/utils/api_url";
    import {
        CheckCircle2,
        Clock,
        XCircle,
        Mail,
        Ticket,
        Calendar,
        MapPin,
        Download,
        Send,
        AlertCircle,
    } from "lucide-svelte";
    import { generatePdf } from "$lib/utils/generate_pdf";
    import { toast } from "svelte-sonner";

    const reference = $page.url.searchParams.get("ref") ?? "";
    const bookingId = $page.url.searchParams.get("bookingId") ?? "";

    let booking = null;
    let status = "waiting"; // waiting | CONFIRMED | cancelled | error
    let errorMsg = "";
    let es = null;

    // États envoi/téléchargement
    let sending = false;
    let sendDone = false;
    let sendError = "";
    let downloading = false;

    // ── Fetch booking ────────────────────────────────────────────────────────
    async function fetchBooking() {
        try {
            const res = await fetch(`${apiUrl}/bookings/verify/${reference}`);
            const json = await res.json();
            if (json.status) booking = json.data;
        } catch {}
    }

    // ── Télécharger ──────────────────────────────────────────────────────────
    async function downloadPdf() {
        downloading = true;
        try {
            console.log("[PDF] début, booking:", booking?.reference);
            console.log("[PDF] issuedTickets:", booking?.issuedTickets);

            const doc = await generatePdf(booking);

            if (doc) {
                doc.save(`billets-${booking.reference}.pdf`);
            } else {
                console.warn(
                    "[PDF] doc est null — issuedTickets probablement vide",
                );
            }
        } catch (e) {
            console.error("[PDF ERROR]", e);
        } finally {
            downloading = false;
        }
    }

    // ── Envoyer par email ────────────────────────────────────────────────────
    async function sendByEmail() {
        sending = true;
        sendError = "";
        sendDone = false;
        try {
            const doc = await generatePdf(booking);
            if (!doc) {
                sendError = "Aucun billet à envoyer.";
                return;
            }

            const base64 = doc.output("datauristring").split(",")[1];

            const res = await fetch(
                `${apiUrl}/bookings/${booking.id}/send-tickets`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pdf: base64 }),
                },
            );
            const json = await res.json();

            if (json.status) sendDone = true;
            else sendError = json.message ?? "Erreur lors de l'envoi.";
        } catch {
            sendError = "Impossible de contacter le serveur.";
        } finally {
            sending = false;
        }
    }

    async function sendOnlineLink() {
        if (!booking?.event?.isOnline || !booking?.event?.onlineUrl) return;

        try {
            await fetch(`${apiUrl}/send-mail`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: booking.userEmail,
                    subject: `Lien de participation — ${booking.event.title}`,
                    content: `
                    <p>Bonjour <strong>${booking.userName}</strong>,</p>
                    <p>Voici votre lien pour rejoindre l'événement en ligne :</p>
                    <div class="cta-wrap">
                        <a href="${booking.event.onlineUrl}" class="cta-btn" target="_blank">
                            Rejoindre l'événement
                        </a>
                    </div>
                    <p>Ou copiez ce lien :<br>
                    <a href="${booking.event.onlineUrl}">${booking.event.onlineUrl}</a></p>
                `,
                }),
            });
        } catch (e) {
            console.error("[SEND_ONLINE_LINK]", e);
        }
    }

    // ── SSE + mount ──────────────────────────────────────────────────────────
    onMount(async () => {
        if (!bookingId || !reference) {
            status = "error";
            errorMsg = "Lien invalide. Référence ou identifiant manquant.";
            return;
        }

        await fetchBooking();

        if (booking?.status === "CONFIRMED") {
            await sendOnlineLink();
            status = "CONFIRMED";
            return;
        }
        if (booking?.status === "CANCELLED") {
            status = "cancelled";
            return;
        }

        es = new EventSource(`${apiUrl}/bookings/status/${bookingId}`);

        es.onmessage = async (e) => {
            const data = JSON.parse(e.data);
            if (data.status === "CONFIRMED") {
                await fetchBooking();
                status = "CONFIRMED";
                es?.close();
                await sendOnlineLink();
            }
        };

        es.onerror = () => {
            fetchBooking().then(() => {
                if (booking?.status === "CONFIRMED") {
                    status = "CONFIRMED";
                    return;
                }
                status = "error";
                errorMsg =
                    "La connexion a été interrompue. Vérifiez votre email ou rafraîchissez la page.";
            });
            es?.close();
        };

        setTimeout(
            () => {
                if (status === "waiting") {
                    es?.close();
                    fetchBooking().then(() => {
                        if (booking?.status === "CONFIRMED") {
                            status = "CONFIRMED";
                            return;
                        }
                        status = "error";
                        errorMsg =
                            "Le délai de confirmation a expiré. Vérifiez votre email ou contactez le support.";
                    });
                }
            },
            10 * 60 * 1000,
        );
    });

    onDestroy(() => es?.close());

    function formatDate(iso) {
        if (!iso) return "—";
        return new Date(iso).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
    function formatPrice(c) {
        if (!c || c === 0) return "Gratuit";
        return `${c.toLocaleString("fr-FR")} FCFA`;
    }
</script>

<svelte:head>
    <title>Confirmation de paiement</title>
</svelte:head>

<div
    class="min-h-screen bg-base-100 flex items-center justify-center px-4 py-12"
>
    <div class="w-full max-w-lg">
        <!-- ── En attente ────────────────────────────────────────────────── -->
        {#if status === "waiting"}
            <div
                class="card bg-base-200 border border-base-300 overflow-hidden"
            >
                <div class="h-1 w-full bg-primary animate-pulse"></div>
                <div class="card-body items-center text-center py-12 gap-6">
                    <div class="relative w-20 h-20">
                        <div
                            class="absolute inset-0 rounded-full bg-primary/10 animate-ping"
                        ></div>
                        <div
                            class="relative w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                        >
                            <Clock size={32} class="text-primary" />
                        </div>
                    </div>
                    <div>
                        <h1 class="font-bold text-xl text-base-content mb-2">
                            Confirmation en cours…
                        </h1>
                        <p
                            class="text-sm text-base-content/45 leading-relaxed max-w-sm"
                        >
                            Nous attendons la confirmation de votre paiement.
                            Cette page se mettra à jour automatiquement.
                        </p>
                    </div>
                    {#if reference}
                        <div
                            class="bg-base-300 border border-base-300 rounded-xl px-6 py-3 w-full text-center"
                        >
                            <p
                                class="text-[10px] uppercase tracking-widest text-base-content/30 mb-0.5"
                            >
                                Référence
                            </p>
                            <p
                                class="font-mono font-bold text-primary tracking-wider"
                            >
                                {reference}
                            </p>
                        </div>
                    {/if}
                    <div class="flex items-center gap-1.5">
                        {#each Array(3) as _, i}
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"
                                style="animation-delay: {i * 150}ms"
                            ></div>
                        {/each}
                        <span
                            class="text-xs text-base-content/25 ml-2 uppercase tracking-wider"
                            >Connexion active</span
                        >
                    </div>
                    <p class="text-[10px] text-base-content/20">
                        Ne fermez pas cette page
                    </p>
                </div>
            </div>

            <!-- ── Confirmé ──────────────────────────────────────────────────── -->
        {:else if status === "CONFIRMED" && booking}
            <div
                class="card bg-base-200 border border-primary/20 overflow-hidden"
            >
                <div class="h-1.5 w-full bg-primary"></div>
                <div class="card-body py-10 gap-6">
                    <div class="flex flex-col items-center text-center gap-4">
                        <div
                            class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                        >
                            <CheckCircle2 size={32} class="text-primary" />
                        </div>
                        <div>
                            <h1
                                class="font-bold text-2xl text-base-content mb-1"
                            >
                                Paiement confirmé !
                            </h1>
                            <p class="text-sm text-base-content/45">
                                Réservation <span
                                    class="text-primary font-mono font-semibold"
                                    >{booking.reference}</span
                                >
                            </p>
                        </div>
                    </div>

                    <!-- Événement -->
                    {#if booking.event}
                        <div
                            class="flex items-center gap-3 p-4 bg-base-300 rounded-xl border border-base-300"
                        >
                            <div class="flex-1 min-w-0">
                                <p
                                    class="font-semibold text-sm text-base-content truncate"
                                >
                                    {booking.event.title}
                                </p>
                                <div class="flex flex-wrap gap-3 mt-1">
                                    <span
                                        class="flex items-center gap-1 text-[11px] text-base-content/35"
                                    >
                                        <Calendar
                                            size={10}
                                            class="text-primary/50"
                                        />
                                        {formatDate(booking.event.dateStart)}
                                    </span>
                                    <span
                                        class="flex items-center gap-1 text-[11px] text-base-content/35"
                                    >
                                        <MapPin
                                            size={10}
                                            class="text-primary/50"
                                        />
                                        {booking.event.isOnline
                                            ? "En ligne"
                                            : (booking.event.city ?? "—")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Billets -->
                    {#if booking.items?.length}
                        <div>
                            <p
                                class="text-[10px] uppercase tracking-widest text-base-content/30 font-bold mb-2 flex items-center gap-1.5"
                            >
                                <Ticket size={10} /> Billets réservés
                            </p>
                            <div class="space-y-1">
                                {#each booking.items as item}
                                    <div
                                        class="flex justify-between text-sm px-3 py-2 bg-base-300 rounded-lg"
                                    >
                                        <span class="text-base-content/60">
                                            {item.ticket.name}
                                            <span class="text-base-content/30"
                                                >× {item.quantity}</span
                                            >
                                        </span>
                                        <span
                                            class="font-semibold text-base-content"
                                            >{formatPrice(
                                                item.price * item.quantity,
                                            )}</span
                                        >
                                    </div>
                                {/each}
                                <div
                                    class="flex justify-between text-sm px-3 pt-2 mt-1 border-t border-base-300 font-bold"
                                >
                                    <span>Total</span>
                                    <span class="text-primary"
                                        >{formatPrice(
                                            booking.totalAmount,
                                        )}</span
                                    >
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Actions PDF -->
                    {#if booking.issuedTickets?.length}
                        <div class="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                on:click={downloadPdf}
                                disabled={downloading}
                                class="btn btn-primary rounded-xl h-11 gap-2 text-xs uppercase tracking-widest font-bold"
                            >
                                {#if downloading}
                                    <span
                                        class="loading loading-spinner loading-xs"
                                    ></span>
                                    Génération…
                                {:else}
                                    <Download size={14} />
                                    Télécharger
                                {/if}
                            </button>

                            <button
                                type="button"
                                on:click={sendByEmail}
                                disabled={sending || sendDone}
                                class="btn rounded-xl h-11 gap-2 text-xs uppercase tracking-widest font-bold
                                       {sendDone
                                    ? 'btn-success'
                                    : 'btn-outline btn-primary'}"
                            >
                                {#if sending}
                                    <span
                                        class="loading loading-spinner loading-xs"
                                    ></span>
                                    Envoi…
                                {:else if sendDone}
                                    <CheckCircle2 size={14} />
                                    Envoyé !
                                {:else}
                                    <Mail size={14} />
                                    Envoyer par email
                                {/if}
                            </button>
                        </div>

                        {#if sendError}
                            <div
                                class="mb-4 flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3"
                            >
                                <AlertCircle size={15} class="shrink-0" />
                                <span class="text-xs font-medium"
                                    >{sendError}</span
                                >
                            </div>
                        {/if}
                    {/if}

                    <!-- Notice email -->

                    <a
                        href="/"
                        class="btn btn-ghost rounded-xl h-11 text-xs uppercase tracking-widest font-bold w-full border border-base-300"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>

            <!-- ── Annulé ─────────────────────────────────────────────────────── -->
        {:else if status === "cancelled"}
            <div
                class="card bg-base-200 border border-error/20 overflow-hidden"
            >
                <div class="h-1.5 w-full bg-error"></div>
                <div class="card-body items-center text-center py-12 gap-5">
                    <div
                        class="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center"
                    >
                        <XCircle size={30} class="text-error" />
                    </div>
                    <div>
                        <h1 class="font-bold text-xl text-base-content mb-2">
                            Réservation annulée
                        </h1>
                        <p class="text-sm text-base-content/40 max-w-sm">
                            Aucun montant ne vous a été débité.
                        </p>
                    </div>
                    <a
                        href="/"
                        class="btn btn-ghost rounded-full border border-base-300 text-xs uppercase tracking-wider px-6"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>

            <!-- ── Erreur ──────────────────────────────────────────────────────── -->
        {:else if status === "error"}
            <div
                class="card bg-base-200 border border-warning/20 overflow-hidden"
            >
                <div class="h-1.5 w-full bg-warning"></div>
                <div class="card-body items-center text-center py-12 gap-5">
                    <div
                        class="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center"
                    >
                        <Clock size={30} class="text-warning" />
                    </div>
                    <div>
                        <h1 class="font-bold text-xl text-base-content mb-2">
                            Vérification impossible
                        </h1>
                        <p
                            class="text-sm text-base-content/40 leading-relaxed max-w-sm"
                        >
                            {errorMsg}
                        </p>
                    </div>
                    {#if reference}
                        <div
                            class="bg-base-300 border border-base-300 rounded-xl px-5 py-2.5 text-center"
                        >
                            <p
                                class="text-[10px] uppercase tracking-widest text-base-content/25 mb-0.5"
                            >
                                Référence
                            </p>
                            <p
                                class="font-mono font-bold text-base-content/50 tracking-wider"
                            >
                                {reference}
                            </p>
                        </div>
                    {/if}
                    <button
                        type="button"
                        on:click={() => window.location.reload()}
                        class="btn btn-ghost btn-sm rounded-full border border-base-300 text-xs uppercase tracking-wider"
                    >
                        Rafraîchir
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>
