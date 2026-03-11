<script>
    import { page } from "$app/stores";
    import {
        AlertCircle,
        Lock,
        Ban,
        Search,
        ServerOff,
        WifiOff,
        Wrench,
        AlertOctagon,
        ArrowLeft,
        Home,
    } from "lucide-svelte";

    $: status = $page.status;
    $: message = $page.error?.message || "Une erreur est survenue";

    const errorConfig = {
        400: {
            title: "Requête invalide",
            description: "La requête envoyée est incorrecte ou mal formée.",
            icon: AlertCircle,
        },
        401: {
            title: "Non autorisé",
            description: "Vous devez être connecté pour accéder à cette page.",
            icon: Lock,
        },
        403: {
            title: "Accès refusé",
            description:
                "Vous n'avez pas la permission d'accéder à cette ressource.",
            icon: Ban,
        },
        404: {
            title: "Page introuvable",
            description:
                "La page que vous recherchez n'existe pas ou a été déplacée.",
            icon: Search,
        },
        500: {
            title: "Erreur serveur",
            description:
                "Une erreur interne est survenue. Veuillez réessayer plus tard.",
            icon: ServerOff,
        },
        502: {
            title: "Mauvaise passerelle",
            description: "Le serveur a reçu une réponse invalide.",
            icon: WifiOff,
        },
        503: {
            title: "Service indisponible",
            description:
                "La plateforme est temporairement indisponible. Réessayez plus tard.",
            icon: Wrench,
        },
    };

    $: info = errorConfig[status] ?? {
        title: "Erreur",
        description: message,
        icon: AlertOctagon,
    };
</script>

<svelte:head>
    <title>{status} — {info.title}</title>
</svelte:head>

<div
    class="min-h-screen bg-base-100 flex flex-col items-center justify-center px-4 text-center"
>
    <!-- Code erreur -->
    <p
        class="font-black text-primary leading-none mb-4 select-none"
        style="font-size: clamp(5rem, 18vw, 8rem); opacity: 0.15"
    >
        {status}
    </p>

    <div class="flex gap-2">
        <!-- Icône -->
        <svelte:component this={info.icon} size={26} class="text-primary" />
        <!-- Titre -->
        <h1 class="font-bold text-base-content text-2xl mb-2">{info.title}</h1>
    </div>

    <!-- Description -->
    <p class="text-sm text-base-content/45 max-w-sm leading-relaxed mb-8">
        {info.description}
    </p>

    <!-- Actions -->
    <div class="flex items-center gap-3">
        <button
            type="button"
            on:click={() => window.history.back()}
            class="btn btn-primary rounded-xl gap-2 text-xs uppercase tracking-widest font-bold"
        >
            Retour
        </button>
        <a
            href="/"
            class="btn btn-ghost border border-base-300 hover:border-primary/30 rounded-xl gap-2 text-xs uppercase tracking-widest"
        >
            Accueil
        </a>
    </div>
</div>
