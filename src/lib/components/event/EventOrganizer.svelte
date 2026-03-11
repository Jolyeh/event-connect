<script>
  import { Star, Calendar, BadgeCheck, MessageCircle } from 'lucide-svelte';

  export let organizer;
  export let recentEvents = [];
</script>

<div class="card bg-base-200 border border-primary/10 hover:border-primary/20 transition-colors duration-200">
  <div class="card-body p-6 gap-5">
    <h3 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/40">Organisé par</h3>

    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4 min-w-0">
        {#if organizer.avatar}
          <img src={organizer.avatar} alt={organizer.name} class="w-14 h-14 rounded-2xl object-cover border border-primary/15 shrink-0" />
        {:else}
          <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary font-bold text-xl shrink-0">
            {organizer.name?.slice(0, 1).toUpperCase() || '?'}
          </div>
        {/if}

        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-0.5 min-w-0">
            <h4 class="font-display text-base font-bold text-base-content truncate">{organizer.name}</h4>
            {#if organizer.verified}
              <BadgeCheck size={14} class="text-primary shrink-0" />
            {/if}
          </div>

          <div class="flex items-center gap-3 text-xs text-base-content/40 flex-wrap">
            {#if organizer.eventCount !== '—'}
              <div class="flex items-center gap-1">
                <Calendar size={11} class="text-primary/50" />
                <span>{organizer.eventCount} événements</span>
              </div>
            {/if}
            {#if organizer.rating !== '—'}
              <div class="flex items-center gap-1">
                <Star size={11} class="text-warning fill-warning" />
                <span>{organizer.rating}</span>
              </div>
            {/if}
            {#if organizer.email}
              <span class="text-base-content/25 truncate max-w-[180px]">{organizer.email}</span>
            {/if}
          </div>
        </div>
      </div>

      {#if organizer.email}
        <a
          href={`mailto:${organizer.email}`}
          class="btn btn-outline btn-sm rounded-full gap-2 shrink-0"
        >
          <MessageCircle size={13} />
          Contacter
        </a>
      {:else}
        <button type="button" class="btn btn-outline btn-sm rounded-full gap-2 shrink-0" disabled>
          <MessageCircle size={13} />
          Contacter
        </button>
      {/if}
    </div>

    {#if recentEvents.length > 0}
      <div class="border-t border-primary/8 pt-4">
        <p class="text-[10px] uppercase tracking-wider text-base-content/25 mb-3">Derniers événements</p>
        <div class="flex gap-2 overflow-auto pb-1">
          {#each recentEvents as ev}
            <a
              href={`/event/${ev.id}`}
              class="flex items-center gap-2 flex-1 p-2 bg-base-300 rounded-xl border border-primary/6 hover:border-primary/20 transition-colors duration-200 min-w-[180px]"
            >
              {#if ev.image}
                <div class="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <img src={ev.image} alt={ev.title} class="w-full h-full object-cover" />
                </div>
              {:else}
                <div class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 shrink-0"></div>
              {/if}
              <div class="min-w-0">
                <p class="text-[10px] font-medium text-base-content/60 truncate">{ev.title}</p>
                <p class="text-[9px] text-base-content/30">{ev.date}</p>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
