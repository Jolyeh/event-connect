<script>
  import {
    Eye, EyeOff, Plus, Trash2, Smartphone,
    CreditCard, Lock, Star, Pencil,
  } from "lucide-svelte";
  import { apiUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";
  import { appName } from "$lib";

  // ── Mot de passe ────────────────────────────────────────────────
  let currentPwd  = "";
  let newPwd      = "";
  let confirmPwd  = "";
  let showCurrent = false;
  let showNew     = false;
  let loadingPwd  = false;

  async function changePassword() {
    if (!currentPwd || !newPwd || !confirmPwd) { toast.error("Remplissez tous les champs."); return; }
    if (newPwd !== confirmPwd) { toast.error("Les mots de passe ne correspondent pas."); return; }
    if (newPwd.length < 8)    { toast.error("Minimum 8 caractères."); return; }
    loadingPwd = true;
    try {
      const res  = await fetch(`${apiUrl}/auth/change-password`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd, confirmPassword: confirmPwd }),
      });
      const json = await res.json();
      if (json.status) {
        toast.success("Mot de passe mis à jour.");
        currentPwd = newPwd = confirmPwd = "";
      } else toast.error(json.message ?? "Erreur lors de la mise à jour.");
    } catch { toast.error("Une erreur est survenue."); }
    finally   { loadingPwd = false; }
  }

  // ── Avis ────────────────────────────────────────────────────────
  let rating        = 0;
  let hovered       = 0;
  let reviewMsg     = "";
  let loadingReview = false;
  let editing       = false;   // true = formulaire visible
  let existingReview = null;   // avis chargé depuis l'API

  // Charger l'avis existant au montage
  async function loadMyReview() {
    try {
      const res  = await fetch(`${apiUrl}/reviews/me`, { credentials: "include" });
      const json = await res.json();
      if (json.status && json.data) {
        existingReview = json.data;
        rating    = json.data.rating;
        reviewMsg = json.data.message;
      }
    } catch {}
  }
  loadMyReview();

  function startEditing() { editing = true; }
  function cancelEditing() {
    editing   = false;
    // Remettre les valeurs initiales
    rating    = existingReview?.rating  ?? 0;
    reviewMsg = existingReview?.message ?? "";
  }

  async function submitReview() {
    if (!rating)           { toast.error("Choisissez une note.");  return; }
    if (!reviewMsg.trim()) { toast.error("Écrivez un message.");   return; }
    loadingReview = true;
    try {
      const res  = await fetch(`${apiUrl}/reviews`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message: reviewMsg }),
      });
      const json = await res.json();
      if (json.status) {
        existingReview = json.data;
        editing = false;
        toast.success(existingReview ? "Avis mis à jour." : "Merci pour votre avis !");
      } else toast.error(json.message);
    } catch { toast.error("Une erreur est survenue."); }
    finally   { loadingReview = false; }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

  <!-- ── Colonne gauche : Mot de passe ──────────────────────────── -->
  <div class="space-y-6">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Lock size={13} class="text-primary" />
        </div>
        <p class="text-[10px] uppercase tracking-[0.25em] text-base-content/35 font-bold">
          Changer le mot de passe
        </p>
      </div>

      <div class="card bg-base-200 border border-base-300 p-4 sm:p-5 space-y-4">

        <div>
          <p class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-1.5">Mot de passe actuel</p>
          <div class="relative">
            <input type={showCurrent ? "text" : "password"} bind:value={currentPwd} placeholder="••••••••"
              class="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary/40 rounded-xl h-11 text-sm pr-11" />
            <button type="button" on:click={() => (showCurrent = !showCurrent)}
              class="absolute z-10 right-3 top-1/2 -translate-y-1/2 text-base-content/25 hover:text-base-content/50">
              {#if showCurrent}<EyeOff size={14} />{:else}<Eye size={14} />{/if}
            </button>
          </div>
        </div>

        <div>
          <p class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-1.5">Nouveau mot de passe</p>
          <div class="relative">
            <input type={showNew ? "text" : "password"} bind:value={newPwd} placeholder="••••••••"
              class="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary/40 rounded-xl h-11 text-sm pr-11" />
            <button type="button" on:click={() => (showNew = !showNew)}
              class="absolute z-10 right-3 top-1/2 -translate-y-1/2 text-base-content/25 hover:text-base-content/50">
              {#if showNew}<EyeOff size={14} />{:else}<Eye size={14} />{/if}
            </button>
          </div>
        </div>

        <div>
          <p class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-1.5">Confirmer</p>
          <input type="password" bind:value={confirmPwd} placeholder="••••••••"
            class="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary/40 rounded-xl h-11 text-sm
                   {confirmPwd && confirmPwd !== newPwd ? 'border-error/40' : ''}" />
          {#if confirmPwd && confirmPwd !== newPwd}
            <p class="text-[11px] text-error mt-1">Les mots de passe ne correspondent pas.</p>
          {/if}
        </div>

        <button type="button" on:click={changePassword} disabled={loadingPwd}
          class="btn btn-primary rounded-xl h-11 text-xs uppercase tracking-widest font-bold w-full">
          {#if loadingPwd}<span class="loading loading-spinner loading-xs mr-1"></span>{/if}
          Mettre à jour
        </button>
      </div>
    </div>
  </div>

  <!-- ── Colonne droite : Avis ───────────────────────────────────── -->
  <div>
    <div class="flex items-center gap-2 mb-3">
      <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Star size={13} class="text-primary" />
      </div>
      <p class="text-[10px] uppercase tracking-[0.25em] text-base-content/35 font-bold">
        Votre avis sur la plateforme
      </p>
    </div>

    <!-- Avis existant affiché (pas en édition) -->
    {#if existingReview && !editing}
      <div class="card bg-base-200 border border-base-300 p-5 space-y-3">
        <!-- Étoiles -->
        <div class="flex items-center gap-1">
          {#each Array(5) as _, i}
            <Star size={18}
              class="{i < existingReview.rating ? 'text-warning fill-warning' : 'text-base-content/10'}" />
          {/each}
          <span class="text-xs text-base-content/30 font-semibold ml-1">{existingReview.rating}/5</span>
        </div>
        <!-- Message -->
        <p class="text-sm text-base-content/70 leading-relaxed">{existingReview.message}</p>
        <!-- Date + bouton modifier -->
        <div class="flex items-center justify-between pt-1">
          <p class="text-[10px] text-base-content/25">
            {new Date(existingReview.updatedAt ?? existingReview.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </p>
          <button type="button" on:click={startEditing}
            class="btn btn-ghost btn-xs rounded-lg border border-base-300 hover:border-primary/30
                   gap-1.5 text-[10px] uppercase tracking-wider text-base-content/40 hover:text-primary">
            <Pencil size={11} /> Modifier
          </button>
        </div>
      </div>

    <!-- Formulaire (nouveau ou modification) -->
    {:else}
      <div class="card bg-base-200 border border-base-300 p-4 sm:p-5 space-y-4">

        <div>
          <p class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-2">Note</p>
          <div class="flex items-center gap-1.5">
            {#each Array(5) as _, i}
              <button type="button"
                on:mouseenter={() => (hovered = i + 1)}
                on:mouseleave={() => (hovered = 0)}
                on:click={() => (rating = i + 1)}
                class="transition-transform duration-100 hover:scale-110">
                <Star size={24}
                  class="{(hovered || rating) > i ? 'text-warning fill-warning' : 'text-base-content/15'}
                         transition-colors duration-100" />
              </button>
            {/each}
            {#if rating}
              <span class="text-xs text-base-content/25 ml-1 font-semibold">{rating}/5</span>
            {/if}
          </div>
        </div>

        <div>
          <p class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-2">Message</p>
          <textarea bind:value={reviewMsg}
            placeholder="Partagez votre expérience sur {appName}…"
            rows="5"
            class="textarea textarea-bordered w-full bg-base-300 border-base-300 focus:border-primary/40 rounded-xl text-sm resize-none">
          </textarea>
        </div>

        <div class="flex gap-2">
          <button type="button" on:click={submitReview} disabled={loadingReview}
            class="btn btn-primary btn-sm h-11 rounded-xl text-xs uppercase tracking-widest font-bold flex-1">
            {#if loadingReview}<span class="loading loading-spinner loading-xs mr-1"></span>{/if}
            {existingReview ? "Mettre à jour" : "Envoyer l'avis"}
          </button>
          {#if existingReview}
            <button type="button" on:click={cancelEditing}
              class="btn btn-ghost btn-sm h-11 rounded-xl border border-base-300 text-xs uppercase tracking-wider">
              Annuler
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>

</div>