<script>
  import { Calendar, MapPin } from "lucide-svelte";
  import EventCard from "../EventCard.svelte";

  export let events = [];
</script>

{#if events.length > 0}
  <div class="mt-14">
    <h3 class="font-display text-2xl font-bold text-base-content mb-6">
      Événements <span class="italic font-light text-primary">similaires</span>
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
      {#each events as event}
        <EventCard {event} />
      {/each}
    </div>
  </div>
{/if}
