<script>
  import { createEventDispatcher } from 'svelte';
  import { MapPin, Clock, Wifi } from 'lucide-svelte';
  import { beninCities } from './types.js';

  export let data;

  const dispatch = createEventDispatcher();

  let dateStart = data.dateStart;
  let timeStart = data.timeStart;
  let dateEnd = data.dateEnd;
  let timeEnd = data.timeEnd;
  let multiDay = data.multiDay;
  let venue = data.venue;
  let address = data.address;
  let city = data.city;
  let capacity = data.capacity;
  let isOnline = data.isOnline;
  let onlineUrl = data.onlineUrl;

  $: dateStart = data.dateStart;
  $: timeStart = data.timeStart;
  $: dateEnd = data.dateEnd;
  $: timeEnd = data.timeEnd;
  $: multiDay = data.multiDay;
  $: venue = data.venue;
  $: address = data.address;
  $: city = data.city;
  $: capacity = data.capacity;
  $: isOnline = data.isOnline;
  $: onlineUrl = data.onlineUrl;

  function update(field, value) {
    dispatch('change', { field, value });
  }
</script>

<div class="flex flex-col gap-8">
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50 flex items-center gap-2">
        <Clock size={12} class="text-primary/50" />
        Date &amp; Heure
      </h3>
      <label class="flex items-center gap-2 cursor-pointer">
        <span class="text-[10px] uppercase tracking-wider text-base-content/30">Plusieurs jours</span>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-xs"
          bind:checked={multiDay}
          on:change={() => update('multiDay', multiDay)}
        />
      </label>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="form-control gap-1.5">
        <label class="label py-0" for="">
          <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">
            {multiDay ? 'Date de début' : 'Date'} <span class="text-primary">*</span>
          </span>
        </label>
        <input
          type="date"
          bind:value={dateStart}
          on:input={() => update('dateStart', dateStart)}
          class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11"
        />
      </div>

      <div class="form-control gap-1.5">
        <label class="label py-0" for="">
          <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">
            Heure de début <span class="text-primary">*</span>
          </span>
        </label>
        <input
          type="time"
          bind:value={timeStart}
          on:input={() => update('timeStart', timeStart)}
          class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11"
        />
      </div>

      {#if multiDay}
        <div class="form-control gap-1.5">
          <label class="label py-0" for="">
            <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">
              Date de fin <span class="text-primary">*</span>
            </span>
          </label>
          <input
            type="date"
            bind:value={dateEnd}
            on:input={() => update('dateEnd', dateEnd)}
            class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11"
          />
        </div>
      {/if}

      <div class="form-control gap-1.5">
        <label class="label py-0" for="">
          <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">Heure de fin</span>
        </label>
        <input
          type="time"
          bind:value={timeEnd}
          on:input={() => update('timeEnd', timeEnd)}
          class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11"
        />
      </div>
    </div>
  </div>

  <div class="divider divider-neutral opacity-40 my-0"></div>

  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50 flex items-center gap-2">
        <MapPin size={12} class="text-primary/50" />
        Lieu
      </h3>
      <label class="flex items-center gap-2 cursor-pointer">
        <Wifi size={12} class="text-primary/40" />
        <span class="text-[10px] uppercase tracking-wider text-base-content/30">Événement en ligne</span>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-xs"
          bind:checked={isOnline}
          on:change={() => update('isOnline', isOnline)}
        />
      </label>
    </div>

    {#if isOnline}
      <div class="form-control flex flex-col w-full gap-2">
        <label class="label py-0" for="">
          <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">
            URL de l&apos;événement <span class="text-primary">*</span>
          </span>
        </label>
        <input
          type="url"
          bind:value={onlineUrl}
          on:input={() => update('onlineUrl', onlineUrl)}
          placeholder="https://meet.google.com/xxx ou https://zoom.us/..."
          class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20"
        />
        <div class="alert bg-primary/8 border border-primary/15 rounded-xl p-3 mt-1">
          <Wifi size={14} class="text-primary shrink-0" />
          <span class="text-xs text-base-content/50">
            Le lien sera partagé aux participants après confirmation de leur réservation.
          </span>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="form-control gap-1.5">
            <label class="label py-0" for="">
              <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">
                Nom du lieu <span class="text-primary">*</span>
              </span>
            </label>
            <input
              type="text"
              bind:value={venue}
              on:input={() => update('venue', venue)}
              placeholder="Ex : Palais des congrès, Stade, Salle…"
              class="input input-bordered bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20"
            />
          </div>
          <div class="form-control gap-1.5">
            <label class="label py-0" for="">
              <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">Adresse complète</span>
            </label>
            <input
              type="text"
              bind:value={address}
              on:input={() => update('address', address)}
              placeholder="221, rue de l'Événement"
              class="input input-bordered bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="form-control gap-1.5">
            <label class="label py-0" for="">
              <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">
                Ville <span class="text-primary">*</span>
              </span>
            </label>
            <select
              bind:value={city}
              on:change={() => update('city', city)}
              class="select select-bordered bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 min-h-0"
            >
              <option value="">Choisir…</option>
              {#each beninCities as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
          </div>
          <div class="form-control gap-1.5">
            <label class="label py-0" for="">
              <span class="label-text text-[10px] uppercase tracking-wider text-base-content/35">Capacité</span>
            </label>
            <input
              type="number"
              min="1"
              bind:value={capacity}
              on:input={() => update('capacity', capacity)}
              placeholder="500"
              class="input input-bordered bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20"
            />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
