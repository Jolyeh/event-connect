<script>
  import { fly } from "svelte/transition";
  import {
    Ticket,
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    Plus,
    Smartphone,
    Trash2,
    CheckCircle,
  } from "lucide-svelte";
  import { apiUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";

  // ── Transactions ────────────────────────────────────────────────
  let transactions = [];
  let loadingTx = true;
  async function loadTransactions() {
    loadingTx = true;
    try {
      const res = await fetch(`${apiUrl}/transactions`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.status) transactions = json.data ?? [];
      else toast.error(json.message);
    } catch {
      toast.error("Impossible de charger les transactions.");
    } finally {
      loadingTx = false;
    }
  }
  loadTransactions();

  function formatPrice(c) {
    if (!c) return "0 FCFA";
    return `${(c / 100).toLocaleString("fr-FR")} FCFA`;
  }
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ── Moyens de paiement ──────────────────────────────────────────
  const METHODS = [
    { key: "MTN", label: "MTN Mobile Money" },
    { key: "MOOV", label: "Moov Money" },
    { key: "WAVE", label: "Wave" },
    { key: "BANK", label: "Virement bancaire" },
  ];

  let paymentMethods = [];
  let loadingPay = false;
  let showAddForm = false;
  let newMethod = "mtn";
  let newNumber = "";

  async function loadMethods() {
    try {
      const res = await fetch(`${apiUrl}/payment-methods`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.status) paymentMethods = json.data ?? [];
    } catch {}
  }
  loadMethods();

  async function addMethod() {
    if (!newNumber.trim()) {
      toast.error("Entrez un numéro.");
      return;
    }
    loadingPay = true;
    try {
      const res = await fetch(`${apiUrl}/payment-methods`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: newMethod, number: newNumber.trim() }),
      });
      const json = await res.json();
      if (json.status) {
        paymentMethods = [...paymentMethods, json.data];
        newNumber = "";
        showAddForm = false;
        toast.success("Moyen de paiement ajouté.");
      } else toast.error(json.message);
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      loadingPay = false;
    }
  }

  async function activateMethod(id) {
    try {
      const res = await fetch(`${apiUrl}/payment-methods/${id}/activate`, {
        method: "PATCH",
        credentials: "include",
      });
      const json = await res.json();
      if (json.status) {
        paymentMethods = json.data;
        toast.success("Moyen de paiement activé.");
      } else toast.error(json.message);
    } catch {
      toast.error("Une erreur est survenue.");
    }
  }

  async function removeMethod(id) {
    try {
      const res = await fetch(`${apiUrl}/payment-methods/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.status) {
        paymentMethods = json.data;
        toast.success("Supprimé.");
      } else toast.error(json.message);
    } catch {
      toast.error("Une erreur est survenue.");
    }
  }
</script>

<div class="space-y-6">
  <!-- ── Moyens de retrait ──────────────────────────────────────── -->
  <div>
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
        >
          <CreditCard size={13} class="text-primary" />
        </div>
        <p
          class="text-[10px] uppercase tracking-[0.25em] text-base-content/35 font-bold"
        >
          Moyens de retrait
        </p>
      </div>
      {#if paymentMethods.length < 3}
        <button
          type="button"
          on:click={() => (showAddForm = !showAddForm)}
          class="btn btn-primary btn-xs rounded-full gap-1.5 text-[10px] uppercase tracking-wider"
        >
          <Plus size={11} /> Ajouter
        </button>
      {/if}
    </div>

    {#if showAddForm}
      <div class="card bg-base-200 border border-primary/20 p-4 space-y-3 mb-3">
        <p
          class="text-[10px] uppercase tracking-[0.2em] text-primary font-bold"
        >
          Nouveau moyen
        </p>
        <div>
          <p
            class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-1.5"
          >
            Moyen
          </p>
          <select
            bind:value={newMethod}
            class="select select-bordered w-full bg-base-300 border-base-300 focus:border-primary/40 rounded-xl h-11 text-sm"
          >
            {#each METHODS as m}
              <option value={m.key}>{m.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <p
            class="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold mb-1.5"
          >
            {newMethod === "bank" ? "IBAN / RIB" : "Numéro"}
          </p>
          <input
            bind:value={newNumber}
            placeholder={newMethod === "bank"
              ? "FR76 XXXX…"
              : "01 XX XX XX XX"}
            class="input input-bordered w-full bg-base-300 border-base-300 focus:border-primary/40 rounded-xl h-11 text-sm"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            on:click={addMethod}
            disabled={loadingPay}
            class="btn btn-primary btn-sm rounded-xl flex-1 text-xs uppercase tracking-wider"
          >
            {#if loadingPay}<span
                class="loading loading-spinner loading-xs mr-1"
              ></span>{/if}
            Confirmer
          </button>
          <button
            type="button"
            on:click={() => (showAddForm = false)}
            class="btn btn-ghost btn-sm rounded-xl border border-base-300 text-xs uppercase tracking-wider"
          >
            Annuler
          </button>
        </div>
      </div>
    {/if}

    {#if paymentMethods.length === 0 && !showAddForm}
      <div class="card bg-base-200 border border-base-300 p-6 text-center">
        <Smartphone size={22} class="text-base-content/15 mx-auto mb-2" />
        <p class="text-xs text-base-content/25">
          Aucun moyen de paiement ajouté.
        </p>
      </div>
    {:else if paymentMethods.length > 0}
      <div class="flex flex-col gap-2">
        {#each paymentMethods as m (m.id)}
          <div
            class="flex items-center justify-between px-3 sm:px-4 py-3 bg-base-200
                       border rounded-xl transition-colors
                       {m.isActive
              ? 'border-primary/30 bg-primary/5'
              : 'border-base-300'}"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm shrink-0"
              >
                {METHODS.find((p) => p.key === m.method)?.icon ?? "💳"}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <p class="text-xs font-semibold text-base-content truncate">
                    {METHODS.find((p) => p.key === m.method)?.label ?? m.method}
                  </p>
                  {#if m.isActive}
                    <span
                      class="badge badge-primary badge-xs text-[9px] font-bold uppercase"
                      >Actif</span
                    >
                  {/if}
                </div>
                <p class="text-[11px] text-base-content/30 font-mono truncate">
                  {m.number}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0 ml-2">
              <!-- Activer -->
              {#if !m.isActive}
                <button
                  type="button"
                  on:click={() => activateMethod(m.id)}
                  title="Définir comme actif"
                  class="btn btn-ghost btn-xs btn-circle text-base-content/20 hover:text-primary hover:bg-primary/10"
                >
                  <CheckCircle size={20} />
                </button>
              {/if}
              <!-- Supprimer -->
              <button
                type="button"
                on:click={() => removeMethod(m.id)}
                title="Supprimer"
                class="btn btn-ghost btn-xs btn-circle text-error/30 hover:text-error hover:bg-error/10"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- ── Transactions ─────────────────────────────────────────────── -->
  <div>
    <div class="flex items-center gap-2 mb-3">
      <div
        class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
      >
        <Ticket size={13} class="text-primary" />
      </div>
      <p
        class="text-[10px] uppercase tracking-[0.25em] text-base-content/35 font-bold"
      >
        Historique des transactions
      </p>
    </div>

    {#if loadingTx}
      <div class="flex flex-col items-center justify-center py-10 gap-2">
        <span class="loading loading-spinner loading-sm text-primary"></span>
        <p class="text-xs text-base-content/25 uppercase tracking-wider">
          Chargement…
        </p>
      </div>
    {:else if transactions.length === 0}
      <div class="card bg-base-200 border border-base-300 p-10 text-center">
        <Ticket size={24} class="text-base-content/15 mx-auto mb-2" />
        <p class="text-sm text-base-content/30">Aucune transaction trouvée.</p>
      </div>
    {:else}
      <div class="card bg-base-200 border border-base-300 overflow-hidden">
        {#each transactions as tx, i (tx.id ?? i)}
          <div
            class="flex items-center justify-between px-3 sm:px-4 py-3
                       {i < transactions.length - 1
              ? 'border-b border-base-300'
              : ''}"
            in:fly={{ y: 4, duration: 160, delay: i * 20 }}
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                          {tx.type === 'credit'
                  ? 'bg-success/10'
                  : 'bg-error/10'}"
              >
                {#if tx.type === "credit"}
                  <ArrowDownLeft size={12} class="text-success" />
                {:else}
                  <ArrowUpRight size={12} class="text-error" />
                {/if}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold text-base-content truncate">
                  {tx.eventTitle ?? tx.description ?? "Transaction"}
                </p>
                <p class="text-[10px] text-base-content/30">
                  {formatDate(tx.createdAt)}
                </p>
              </div>
            </div>
            <div class="text-right shrink-0 ml-3">
              <p
                class="font-bold text-sm {tx.type === 'credit'
                  ? 'text-success'
                  : 'text-error'}"
              >
                {tx.type === "credit" ? "+" : "−"}{formatPrice(tx.amount)}
              </p>
              <p
                class="text-[10px] font-semibold uppercase tracking-wider
                        {tx.type === 'credit'
                  ? 'text-success/50'
                  : 'text-error/50'}"
              >
                {tx.type === "credit" ? "Reçu" : "Dépensé"}
              </p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
