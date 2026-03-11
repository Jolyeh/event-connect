<script>
  import { createEventDispatcher } from "svelte";
  import { Plus, Trash2, Ticket, Info } from "lucide-svelte";
  import { appName } from "$lib";

  export let data;

  const dispatch = createEventDispatcher();

  let isFree = data.isFree;
  let saleStart = data.saleStart;
  let saleEnd = data.saleEnd;

  $: isFree = data.isFree;
  $: saleStart = data.saleStart;
  $: saleEnd = data.saleEnd;

  function genId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function update(field, value) {
    dispatch("change", { field, value });
  }

  function addTicket() {
    update("tickets", [
      ...data.tickets,
      { id: genId(), name: "", price: "", quantity: "", description: "" },
    ]);
  }

  function updateTicket(id, field, value) {
    update(
      "tickets",
      data.tickets.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  }

  function removeTicket(id) {
    update(
      "tickets",
      data.tickets.filter((t) => t.id !== id),
    );
  }
</script>

<div class="flex flex-col gap-8">
  <div
    class="flex items-center justify-between p-4 bg-base-300 rounded-2xl border border-primary/10"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
      >
        <Ticket size={18} class="text-primary" />
      </div>
      <div>
        <div class="text-sm font-semibold text-base-content">
          Événement gratuit
        </div>
        <div class="text-[11px] text-base-content/35">
          Aucun billet payant requis
        </div>
      </div>
    </div>
    <input
      type="checkbox"
      class="toggle toggle-primary"
      bind:checked={isFree}
      on:change={() => update("isFree", isFree)}
    />
  </div>

  {#if !isFree}
    <div class="flex flex-col gap-4 overflow-hidden">
      <div class="flex items-center justify-between">
        <h3
          class="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50"
        >
          Catégories de billets <span class="text-primary">*</span>
        </h3>
        <button
          type="button"
          on:click={addTicket}
          class="btn btn-primary btn-xs rounded-full gap-1.5 text-[10px] uppercase tracking-wider shadow-md shadow-primary/20"
        >
          <Plus size={12} />
          Ajouter
        </button>
      </div>

      {#if data.tickets.length === 0}
        <div
          class="border-2 border-dashed border-primary/12 rounded-2xl p-8 flex flex-col items-center gap-3 bg-base-300"
        >
          <Ticket size={28} class="text-base-content/15" />
          <p class="text-sm text-base-content/30 text-center">
            Aucune catégorie de billet.<br />
            <button
              type="button"
              on:click={addTicket}
              class="text-primary hover:underline"
            >
              Créez votre première catégorie
            </button>
          </p>
        </div>
      {/if}

      {#each data.tickets as ticket, i (ticket.id)}
        <div
          class="card bg-base-300 border border-primary/12 hover:border-primary/25 transition-colors duration-200"
        >
          <div class="card-body p-5 gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary"
                >
                  {i + 1}
                </div>
                <span
                  class="text-[10px] uppercase tracking-widest text-base-content/30"
                  >Catégorie #{i + 1}</span
                >
              </div>
              <button
                type="button"
                on:click={() => removeTicket(ticket.id)}
                class="btn btn-ghost btn-xs text-error/40 hover:text-error rounded-full"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="form-control gap-1.5">
                <label
                  for=""
                  class="label-text text-[10px] uppercase tracking-wider text-base-content/35"
                >
                  Nom du billet <span class="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={ticket.name}
                  on:input={(e) =>
                    updateTicket(ticket.id, "name", e.currentTarget.value)}
                  placeholder="Ex : Standard, VIP, Early Bird…"
                  class="input input-bordered input-sm bg-base-200 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl placeholder:text-base-content/20 h-10"
                />
              </div>

              <div class="form-control flex flex-col gap-1.5">
                <label
                  for=""
                  class="label-text text-[10px] uppercase tracking-wider text-base-content/35"
                >
                  Prix (FCFA) <span class="text-primary">*</span>
                </label>
                <div class="join">
                  <span
                    class="join-item bg-primary/10 border border-primary/20 px-3 flex items-center text-primary font-semibold text-sm rounded-l-xl"
                    >FCFA</span
                  >
                  <input
                    type="number"
                    min="0"
                    value={ticket.price}
                    on:input={(e) =>
                      updateTicket(ticket.id, "price", e.currentTarget.value)}
                    placeholder="00"
                    class="input input-bordered input-sm join-item bg-base-200 border-primary/15 border-l-0 focus:border-primary/50 focus:outline-none text-sm flex-1 placeholder:text-base-content/20 h-10 rounded-r-xl"
                  />
                </div>
              </div>

              <div class="form-control gap-1.5">
                <label
                  for=""
                  class="label-text text-[10px] uppercase tracking-wider text-base-content/35"
                >
                  Quantité disponible <span class="text-primary">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={ticket.quantity}
                  on:input={(e) =>
                    updateTicket(ticket.id, "quantity", e.currentTarget.value)}
                  placeholder="100"
                  class="input input-bordered input-sm bg-base-200 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl placeholder:text-base-content/20 h-10"
                />
              </div>

              <div class="form-control gap-1.5">
                <label
                  for=""
                  class="label-text text-[10px] uppercase tracking-wider text-base-content/35"
                  >Description courte</label
                >
                <input
                  type="text"
                  value={ticket.description}
                  on:input={(e) =>
                    updateTicket(
                      ticket.id,
                      "description",
                      e.currentTarget.value,
                    )}
                  placeholder="Accès général, places assises…"
                  class="input input-bordered input-sm bg-base-200 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl placeholder:text-base-content/20 h-10"
                />
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="divider divider-neutral opacity-40 my-0"></div>

    <div class="form-control gap-3">
      <h3
        class="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50"
      >
        Période de vente
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="form-control gap-1.5">
          <label
            for=""
            class="label-text text-[10px] uppercase tracking-wider text-base-content/35"
            >Ouverture des ventes</label
          >
          <input
            type="date"
            bind:value={saleStart}
            on:input={() => update("saleStart", saleStart)}
            class="input input-bordered bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11"
          />
        </div>
        <div class="form-control gap-1.5">
          <label
            for=""
            class="label-text text-[10px] uppercase tracking-wider text-base-content/35"
            >Clôture des ventes</label
          >
          <input
            type="date"
            bind:value={saleEnd}
            on:input={() => update("saleEnd", saleEnd)}
            class="input input-bordered bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11"
          />
        </div>
      </div>
    </div>

    <div class="alert bg-primary/8 border border-primary/15 rounded-2xl p-4">
      <Info size={16} class="text-primary shrink-0" />
      <div class="text-xs text-base-content/50 leading-relaxed">
        <span class="font-semibold text-primary">Commission {appName} : 5%</span
        >
        sur chaque billet vendu. Aucun abonnement, aucun frais fixe.
      </div>
    </div>
  {/if}
</div>
