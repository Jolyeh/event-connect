<script>
  import { Calendar, Check, Clock, Shield, Ticket, Gift } from "lucide-svelte";

  export let eventId;
  export let tickets = [];
  export let isFree = false;
  export let spotsLeft = 0;
  export let date;
  export let time = "";
  export let bookingBaseUrl = "/reserver";

  let selected = tickets[0]?.id ?? "";
  let qty = 1;

  $: if (!selected && tickets.length > 0) {
    selected = tickets[0].id;
  }

  $: currentTicket = tickets.find((t) => t.id === selected) ?? tickets[0];
  $: subtotal = isFree ? 0 : (currentTicket?.price ?? 0) * qty;
  $: total = subtotal;
  $: bookingHref = currentTicket
    ? `${bookingBaseUrl}/${eventId}?ticketId=${currentTicket.id}&qty=${qty}`
    : `${bookingBaseUrl}/${eventId}`;
</script>

<div
  class="card bg-base-200 border border-primary/15 shadow-2xl shadow-black/20 sticky top-24"
>
  <div class="card-body p-6 gap-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Ticket size={16} class="text-primary" />
        <h3 class="font-display text-lg font-bold text-base-content">
          Billetterie
        </h3>
      </div>
      {#if spotsLeft > 0}
        <div class="flex items-center gap-1 text-primary text-xs font-medium">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          {spotsLeft} places
        </div>
      {:else if spotsLeft === 0 && !isFree}
        <span class="badge badge-error badge-outline text-[10px] uppercase"
          >Complet</span
        >
      {/if}
    </div>

    <!-- Date/heure -->
    <div
      class="flex items-center gap-3 p-3 bg-base-300 rounded-xl border border-primary/8"
    >
      <Calendar size={14} class="text-primary/60 shrink-0" />
      <div>
        <div class="text-xs font-semibold text-base-content">{date}</div>
        {#if time}
          <div
            class="flex items-center gap-1 text-[11px] text-base-content/40 mt-0.5"
          >
            <Clock size={10} />
            {time}
          </div>
        {/if}
      </div>
    </div>

    <!-- Événement gratuit -->
    {#if isFree}
      <div
        class="flex items-center gap-3 p-4 bg-primary/8 border border-primary/20 rounded-xl"
      >
        <Gift size={18} class="text-primary shrink-0" />
        <div>
          <p class="text-sm font-semibold text-primary">Événement gratuit</p>
          <p class="text-[11px] text-base-content/40 mt-0.5">
            Aucun billet requis — accès libre
          </p>
        </div>
      </div>

      <!-- Tickets payants -->
    {:else if tickets.length > 0}
      <div class="flex flex-col gap-2">
        {#each tickets as ticket}
          <button
            type="button"
            on:click={() => (selected = ticket.id)}
            class={`flex items-center justify-between p-3 rounded-xl border text-left ${selected === ticket.id ? "border-primary bg-primary/10" : "border-primary/10 bg-base-300 hover:border-primary/30"}`}
          >
            <div class="flex items-center gap-2">
              <div
                class={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === ticket.id ? "border-primary bg-primary" : "border-base-content/20"}`}
              >
                {#if selected === ticket.id}
                  <Check size={9} class="text-primary-content" />
                {/if}
              </div>
              <div>
                <div class="text-xs font-semibold text-base-content">
                  {ticket.name}
                </div>
                <div class="text-[10px] text-base-content/30">
                  {ticket.description ||
                    `${ticket.available ?? "—"} disponibles`}
                </div>
              </div>
            </div>
            <span class="font-bold text-primary text-sm shrink-0 ml-2">
              {ticket.price <= 0 ? "Gratuit" : `${ticket.price}FCFA`}
            </span>
          </button>
        {/each}
      </div>

      <!-- Quantité -->
      <div class="form-control gap-2">
        <label
          class="label-text text-[10px] uppercase tracking-[0.2em] text-base-content/40 font-semibold"
          for="">Quantité</label
        >
        <div class="flex items-center gap-3">
          <button
            type="button"
            on:click={() => (qty = Math.max(1, qty - 1))}
            class="btn btn-circle btn-sm bg-base-300 border border-primary/15"
            >−</button
          >
          <span class="text-lg font-bold text-base-content w-8 text-center"
            >{qty}</span
          >
          <button
            type="button"
            on:click={() => (qty = Math.min(8, qty + 1))}
            class="btn btn-circle btn-sm bg-base-300 border border-primary/15"
            >+</button
          >
        </div>
      </div>

      <!-- Résumé prix -->
      <div
        class="flex flex-col gap-2 p-3 bg-base-300 rounded-xl border border-primary/8"
      >
        <div class="flex justify-between text-xs text-base-content/50">
          <span>{currentTicket?.price ?? 0}FCFA × {qty}</span>
          <span>{subtotal}FCFA</span>
        </div>
        <div
          class="flex justify-between text-sm font-bold text-base-content border-t border-primary/10 pt-2 mt-1"
        >
          <span>Total</span>
          <span class="text-primary">{total}FCFA</span>
        </div>
      </div>
    {:else}
      <p class="text-sm text-base-content/30 text-center py-2">
        Aucun billet disponible.
      </p>
    {/if}

    <!-- CTA -->
    <a
      href={bookingHref}
      class="btn btn-primary w-full rounded-xl gap-2 text-xs uppercase tracking-widest font-semibold h-12"
      class:btn-disabled={!isFree && tickets.length === 0}
    >
      <Ticket size={15} />
      {isFree
        ? "Participer gratuitement"
        : `Payer — ${total}FCFA`}
    </a>

    <div
      class="flex items-center justify-center gap-3 pt-2 border-t border-primary/8"
    >
      <div class="flex items-center gap-1 text-base-content/25">
        <Shield size={11} class="text-primary/50" />
        <span class="text-[10px] uppercase tracking-wider"
          >Paiement sécurisé</span
        >
      </div>
    </div>
  </div>
</div>
