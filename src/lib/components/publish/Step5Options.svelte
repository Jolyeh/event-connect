<script>
  import { createEventDispatcher } from 'svelte';
  import { Tag, Eye, UserCheck, Users, RefreshCcw, Globe, X, Info } from 'lucide-svelte';

  export let data;
  /** @type {Array<{id: string, name: string, slug: string}>} */
  export let tags = [];

  const dispatch = createEventDispatcher();

  let tagInput = '';
  let ageRestriction = data.ageRestriction;
  let contactEmail = data.contactEmail;
  let website = data.website;

  $: ageRestriction = data.ageRestriction;
  $: contactEmail = data.contactEmail;
  $: website = data.website;

  // Tags disponibles = API minus ceux déjà sélectionnés
  $: availableTags = tags.filter((t) => !data.tags.includes(t.name.toLowerCase()));


  function update(field, value) {
    dispatch('change', { field, value });
  }

  function addTag(rawName) {
    const trimmed = rawName.trim().toLowerCase();
    if (!trimmed || data.tags.includes(trimmed) || data.tags.length >= 10) return;
    update('tags', [...data.tags, trimmed]);
    tagInput = '';
  }

  function removeTag(tag) {
    update('tags', data.tags.filter((item) => item !== tag));
  }

  function handleTagKeyDown(event) {
    if ((event.key === 'Enter' || event.key === ',') && tagInput.trim()) {
      event.preventDefault();
      addTag(tagInput);
    }
  }
</script>

<div class="flex flex-col gap-8">
  <div class="form-control gap-3">
    <div class="flex items-center justify-between">
      <label class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50 flex items-center gap-2">
        <Tag size={12} class="text-primary/50" />
        Tags
      </label>
      <span class="text-[10px] text-base-content/25">{data.tags.length}/10</span>
    </div>

    <div class="input input-bordered w-full bg-base-300 border-primary/15 focus-within:border-primary/50 rounded-xl min-h-11 h-auto flex flex-wrap gap-1.5 items-center px-3 py-2 transition-colors duration-200 overflow-hidden">
      {#each data.tags as tag}
        <span class="badge badge-primary badge-outline text-[10px] uppercase tracking-wider gap-1 py-2 px-2 shrink-0">
          {tag}
          <button type="button" on:click={() => removeTag(tag)} class="hover:text-error transition-colors">
            <X size={9} />
          </button>
        </span>
      {/each}
      {#if data.tags.length < 10}
        <input
          type="text"
          bind:value={tagInput}
          on:keydown={handleTagKeyDown}
          placeholder={data.tags.length === 0 ? 'Tapez un tag et appuyez sur Entrée…' : ''}
          class="bg-transparent outline-none text-sm flex-1 min-w-[60px] placeholder:text-base-content/20"
        />
      {/if}
    </div>

    <!-- Suggestions depuis l'API (tags existants) + tags statiques si API vide -->
    {#if availableTags.length > 0 || data.tags.length < 10}
      <div class="flex flex-col items-start mt-1 gap-1.5 w-full">
        <span class="text-[10px] uppercase tracking-wider text-base-content/20 shrink-0">Suggestions :</span>
        <div class="flex flex-wrap gap-1.5 pb-1">
          {#each (availableTags.length > 0 ? availableTags : [
            { name: 'musique live' }, { name: 'famille' }, { name: 'extérieur' },
            { name: 'networking' }, { name: 'afterwork' }, { name: 'culture' },
            { name: 'bien-être' }, { name: 'prestige' }, { name: 'international' }
          ]).filter(t => !data.tags.includes(t.name.toLowerCase())).slice(0, 10) as tag}
            <button
              type="button"
              on:click={() => addTag(tag.name)}
              class="badge badge-outline border-primary/12 text-base-content/30 hover:border-primary/40 hover:text-primary hover:bg-primary/8 text-[10px] py-2 px-2.5 cursor-pointer transition-all duration-200 whitespace-nowrap"
            >
              + {tag.name}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="divider divider-neutral opacity-40 my-0"></div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="form-control gap-2">
      <label for="" class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50">Restriction d&apos;âge</label>
      <select
        bind:value={ageRestriction}
        on:change={() => update('ageRestriction', ageRestriction)}
        class="select select-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl"
      >
        <option value="">Aucune restriction</option>
        <option value="16+">16 ans et plus</option>
        <option value="18+">18 ans et plus</option>
        <option value="21+">21 ans et plus</option>
      </select>
    </div>

    <div class="form-control gap-2">
      <label for="" class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50">E-mail de contact</label>
      <input
        type="email"
        bind:value={contactEmail}
        on:input={() => update('contactEmail', contactEmail)}
        placeholder="contact@monorganisation.fr"
        class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl placeholder:text-base-content/20"
      />
    </div>

    <div class="form-control gap-2 sm:col-span-2">
      <label for="" class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50">Site web</label>
      <input
        type="url"
        bind:value={website}
        on:input={() => update('website', website)}
        placeholder="https://www.votre-site.fr"
        class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20"
      />
    </div>
  </div>

  <div class="alert bg-base-300 border border-primary/10 rounded-2xl p-4">
    <Info size={15} class="text-primary/50 shrink-0" />
    <p class="text-xs text-base-content/40 leading-relaxed">
      Votre événement sera soumis à validation avant publication. Notre équipe le vérifiera sous <strong class="text-primary">24h</strong>.
    </p>
  </div>
</div>
