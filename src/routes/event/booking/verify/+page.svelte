<script>
    import { onMount, onDestroy } from "svelte";
    import { apiUrl } from "$lib/utils/api_url";
    import { CheckCircle2, XCircle, ScanLine, RotateCcw, Ticket, Calendar, MapPin, User } from "lucide-svelte";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";

    let scannerEl;
    let html5QrCode = null;

    // États
    let scanStatus  = "scanning"; // scanning | loading | valid | invalid | used
    let lastCode    = null;
    let ticketData  = null;
    let errorMsg    = "";
    let cooldown    = false; // évite les scans en double

    // ── Démarrer le scanner ───────────────────────────────────────────────
    async function startScanner() {
        const { Html5Qrcode } = await import("html5-qrcode");

        html5QrCode = new Html5Qrcode("qr-reader");

        try {
            await html5QrCode.start(
                { facingMode: "environment" }, // caméra arrière
                {
                    fps: 10,
                    qrbox: { width: 250, height: 140 },
                    aspectRatio: 1.6,
                },
                onScanSuccess,
                () => {} // erreurs silencieuses (lecture continue)
            );
        } catch (err) {
            scanStatus = "invalid";
            errorMsg   = "Impossible d'accéder à la caméra. Vérifiez les permissions.";
        }
    }

    // ── Callback scan réussi ──────────────────────────────────────────────
    async function onScanSuccess(code) {
        if (cooldown || code === lastCode) return;
        cooldown = true;

        // Vérifier que c'est bien un code TKT
        if (!code.startsWith("TKT-")) {
            cooldown = false;
            return;
        }

        lastCode   = code;
        scanStatus = "loading";

        try {
            // 1. Vérifier le billet
            const res  = await fetch(`${apiUrl}/tickets/verify/${code}`);
            const json = await res.json();

            if (!json.status) {
                scanStatus = "invalid";
                errorMsg   = json.message ?? "Billet invalide.";
                return;
            }

            const ticket = json.data;

            if (ticket.usedAt) {
                scanStatus = "used";
                ticketData = ticket;
                return;
            }

            // 2. Marquer comme utilisé
            const useRes  = await fetch(`${apiUrl}/tickets/use/${code}`, { method: "POST" });
            const useJson = await useRes.json();

            if (!useJson.status) {
                scanStatus = "invalid";
                errorMsg   = useJson.message ?? "Erreur lors de la validation.";
                return;
            }

            ticketData = useJson.data;
            scanStatus = "valid";

        } catch {
            scanStatus = "invalid";
            errorMsg   = "Impossible de contacter le serveur.";
        }
    }

    // ── Réinitialiser pour scanner à nouveau ──────────────────────────────
    async function reset() {
        ticketData  = null;
        lastCode    = null;
        errorMsg    = "";
        cooldown    = false;
        scanStatus  = "scanning";
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────
    onMount(() => startScanner());

    onDestroy(async () => {
        if (html5QrCode?.isScanning) {
            await html5QrCode.stop();
        }
    });

    function formatDate(iso) {
        if (!iso) return "—";
        return new Date(iso).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric",
        });
    }

    function formatTime(iso) {
        if (!iso) return "";
        return new Date(iso).toLocaleTimeString("fr-FR", {
            hour: "2-digit", minute: "2-digit",
        });
    }
</script>

<Navbar/>

<div class="bg-base-100 flex flex-col items-center px-4 py-8 pt-24 gap-6">

    <!-- Header -->
    <div class="w-full max-w-md text-center">
        <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <ScanLine size={14} class="text-primary" />
            <span class="text-xs font-bold uppercase tracking-widest text-primary">Vérification</span>
        </div>
        <h1 class="text-xl font-bold text-base-content">Scanner un billet</h1>
        <p class="text-xs text-base-content/40 mt-1">Pointez la caméra vers le QR code du billet</p>
    </div>

    <!-- Zone scanner -->
    <div class="w-full max-w-md">
        <div class="relative rounded-2xl overflow-hidden border border-base-300 bg-base-200"
             class:hidden={scanStatus !== "scanning" && scanStatus !== "loading"}>

            <!-- Élément scanner -->
            <div id="qr-reader" bind:this={scannerEl} class="w-full"></div>

            <!-- Overlay coins -->
            <div class="absolute inset-0 pointer-events-none">
                <!-- Coin haut-gauche -->
                <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                <!-- Coin haut-droit -->
                <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                <!-- Coin bas-gauche -->
                <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                <!-- Coin bas-droit -->
                <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
                <!-- Ligne de scan animée -->
                <div class="absolute left-8 right-8 h-0.5 bg-primary/60 scan-line"></div>
            </div>

            <!-- Overlay loading -->
            {#if scanStatus === "loading"}
                <div class="absolute inset-0 bg-base-100/80 flex items-center justify-center backdrop-blur-sm">
                    <span class="loading loading-spinner loading-md text-primary"></span>
                </div>
            {/if}
        </div>

        <!-- ── Résultat : VALIDE ─────────────────────────────────────────── -->
        {#if scanStatus === "valid" && ticketData}
            <div class="card bg-base-200 border border-success/30 overflow-hidden">
                <div class="h-1.5 w-full bg-success"></div>
                <div class="card-body gap-5 py-8">
                    <div class="flex flex-col items-center gap-3 text-center">
                        <div class="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
                            <CheckCircle2 size={32} class="text-success" />
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-widest text-success font-bold mb-1">Billet valide</p>
                            <h2 class="text-xl font-bold text-base-content">{ticketData.booking?.event?.title ?? "—"}</h2>
                        </div>
                    </div>

                    <!-- Infos billet -->
                    <div class="space-y-1">
                        <div class="flex justify-between items-center px-3 py-2.5 bg-base-300 rounded-lg">
                            <span class="flex items-center gap-2 text-xs text-base-content/50">
                                <User size={12} class="text-primary/60" /> Titulaire
                            </span>
                            <span class="text-xs font-semibold text-base-content">{ticketData.booking?.userName ?? "—"}</span>
                        </div>
                        <div class="flex justify-between items-center px-3 py-2.5 bg-base-300 rounded-lg">
                            <span class="flex items-center gap-2 text-xs text-base-content/50">
                                <Ticket size={12} class="text-primary/60" /> Type
                            </span>
                            <span class="text-xs font-semibold text-base-content">{ticketData.ticket?.name ?? "—"}</span>
                        </div>
                        <div class="flex justify-between items-center px-3 py-2.5 bg-base-300 rounded-lg">
                            <span class="flex items-center gap-2 text-xs text-base-content/50">
                                <Calendar size={12} class="text-primary/60" /> Date
                            </span>
                            <span class="text-xs font-semibold text-base-content">
                                {formatDate(ticketData.booking?.event?.dateStart)}
                            </span>
                        </div>
                        {#if ticketData.booking?.event?.city || ticketData.booking?.event?.venue}
                            <div class="flex justify-between items-center px-3 py-2.5 bg-base-300 rounded-lg">
                                <span class="flex items-center gap-2 text-xs text-base-content/50">
                                    <MapPin size={12} class="text-primary/60" /> Lieu
                                </span>
                                <span class="text-xs font-semibold text-base-content">
                                    {[ticketData.booking?.event?.venue, ticketData.booking?.event?.city].filter(Boolean).join(", ")}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <!-- Code -->
                    <div class="text-center">
                        <span class="font-mono text-xs text-primary/60 bg-primary/8 border border-primary/15 px-3 py-1 rounded-lg">
                            {lastCode}
                        </span>
                    </div>

                    <button on:click={reset} class="btn btn-primary rounded-xl h-11 gap-2 text-xs uppercase tracking-widest font-bold w-full">
                        <ScanLine size={14} /> Scanner un autre billet
                    </button>
                </div>
            </div>

        <!-- ── Résultat : DÉJÀ UTILISÉ ───────────────────────────────────── -->
        {:else if scanStatus === "used" && ticketData}
            <div class="card bg-base-200 border border-warning/30 overflow-hidden">
                <div class="h-1.5 w-full bg-warning"></div>
                <div class="card-body gap-5 py-8">
                    <div class="flex flex-col items-center gap-3 text-center">
                        <div class="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                            <XCircle size={32} class="text-warning" />
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-widest text-warning font-bold mb-1">Billet déjà utilisé</p>
                            <h2 class="text-xl font-bold text-base-content">{ticketData.booking?.event?.title ?? "—"}</h2>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 p-4 bg-warning/8 border border-warning/20 rounded-xl">
                        <XCircle size={16} class="text-warning shrink-0" />
                        <div>
                            <p class="text-xs font-semibold text-warning">Entrée refusée</p>
                            <p class="text-xs text-base-content/45 mt-0.5">
                                Ce billet a été scanné le {formatDate(ticketData.usedAt)} à {formatTime(ticketData.usedAt)}
                            </p>
                        </div>
                    </div>

                    <button on:click={reset} class="btn btn-warning btn-outline rounded-xl h-11 gap-2 text-xs uppercase tracking-widest font-bold w-full">
                        <ScanLine size={14} /> Scanner à nouveau
                    </button>
                </div>
            </div>

        <!-- ── Résultat : INVALIDE ───────────────────────────────────────── -->
        {:else if scanStatus === "invalid"}
            <div class="card bg-base-200 border border-error/30 overflow-hidden">
                <div class="h-1.5 w-full bg-error"></div>
                <div class="card-body gap-5 py-8">
                    <div class="flex flex-col items-center gap-3 text-center">
                        <div class="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center">
                            <XCircle size={32} class="text-error" />
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-widest text-error font-bold mb-1">Billet invalide</p>
                            <p class="text-sm text-base-content/50">{errorMsg}</p>
                        </div>
                    </div>

                    <button on:click={reset} class="btn btn-error btn-outline rounded-xl h-11 gap-2 text-xs uppercase tracking-widest font-bold w-full">
                        <RotateCcw size={14} /> Réessayer
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<Footer/>

<style>
    /* Ligne de scan animée */
    .scan-line {
        top: 50%;
        animation: scan 2s ease-in-out infinite;
    }
    @keyframes scan {
        0%, 100% { top: 25%; opacity: 1; }
        50%       { top: 75%; opacity: 0.6; }
    }

    /* Masquer les éléments natifs html5-qrcode */
    :global(#qr-reader__scan_region) {
        border: none !important;
    }
    :global(#qr-reader__dashboard) {
        display: none !important;
    }
    :global(#qr-reader video) {
        width: 100% !important;
        border-radius: 0 !important;
    }
</style>