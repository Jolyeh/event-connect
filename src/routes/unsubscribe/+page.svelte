<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { apiUrl } from "$lib/utils/api_url";
  import { Mail, CheckCircle, XCircle, Loader } from "lucide-svelte";
  import { appName } from "$lib";

  let status  = "loading"; // "loading" | "success" | "error" | "invalid"
  let message = "";

  onMount(async () => {
    const email = $page.url.searchParams.get("email");

    if (!email) {
      status = "invalid";
      return;
    }

    try {
      const res  = await fetch(`${apiUrl}/newsletters/unsubscribe`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (json.status) {
        status = "success";
      } else {
        status  = "error";
        message = json.message ?? "Une erreur est survenue.";
      }
    } catch {
      status  = "error";
      message = "Impossible de contacter le serveur. Réessayez plus tard.";
    }
  });
</script>

<svelte:head>
  <title>Désinscription — {appName}</title>
</svelte:head>

<div class="min-h-screen bg-base-100 flex items-center justify-center px-4">
  <div class="w-full max-w-md text-center">

    <!-- Logo / Nom app -->
    <p class="text-[11px] uppercase tracking-[0.3em]  text-base-content/20 font-bold mb-10">
      {appName}
    </p>

    <!-- ── Chargement ─────────────────────────────────────────── -->
    {#if status === "loading"}
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>
        <p class="text-sm text-base-content/40">Traitement en cours…</p>
      </div>

    <!-- ── Succès ──────────────────────────────────────────────── -->
    {:else if status === "success"}
      <div class="flex flex-col items-center gap-5">
        <div class="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
          <CheckCircle size={28} class="text-success" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-base-content mb-2">Désinscription confirmée</h1>
          <p class="text-sm text-base-content/45 leading-relaxed max-w-sm mx-auto">
            Vous ne recevrez plus d'emails de notre part. Nous espérons vous revoir bientôt sur {appName}.
          </p>
        </div>
        <div class="w-full card bg-base-200 border border-base-300 p-4 flex items-center gap-3 text-left">
          <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Mail size={15} class="text-primary" />
          </div>
          <p class="text-xs text-base-content/40 leading-relaxed">
            Vous pouvez vous réinscrire à tout moment depuis notre site.
          </p>
        </div>
      </div>

    <!-- ── Email manquant ─────────────────────────────────────── -->
    {:else if status === "invalid"}
      <div class="flex flex-col items-center gap-5">
        <div class="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
          <Mail size={28} class="text-warning" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-base-content mb-2">Lien invalide</h1>
          <p class="text-sm text-base-content/45 leading-relaxed max-w-sm mx-auto">
            Assurez-vous d'utiliser le lien exact reçu dans votre email.
          </p>
        </div>
      </div>

    <!-- ── Erreur ──────────────────────────────────────────────── -->
    {:else if status === "error"}
      <div class="flex flex-col items-center gap-5">
        <div class="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center">
          <XCircle size={28} class="text-error" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-base-content mb-2">Échec de la désinscription</h1>
          <p class="text-sm text-base-content/45 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>
      </div>
    {/if}

  </div>
</div>