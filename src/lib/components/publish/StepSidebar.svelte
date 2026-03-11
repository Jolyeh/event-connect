<script>
  import { Calendar, MapPin, Image as ImageIcon, Check } from 'lucide-svelte';

  /** @type {import('./types.js').StepDefinition[]} */
  export let steps = [];
  export let current = 1;
  export let progress = 0;
  /** @type {import('./types.js').PreviewData} */
  export let preview;
</script>

<aside class="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 border-r border-primary/10 min-h-[calc(100vh-68px)] sticky top-[68px] self-start">
  <div class="px-6 py-5 border-t border-primary/8">
    <div class="flex justify-between items-center mb-2">
      <span class="text-[10px] uppercase tracking-widest text-base-content/25">Progression</span>
      <span class="text-xs font-bold text-primary">{progress}%</span>
    </div>

    <div class="h-1.5 bg-base-300 rounded-full overflow-hidden">
      <div class="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={`width:${progress}%`} />
    </div>
  </div>

  <div class="px-4 pb-6">
    <p class="text-[10px] uppercase tracking-[0.22em] text-base-content/25 mb-3 px-2">Aperçu de la carte</p>

    <div class="card bg-base-300 border border-primary/12 overflow-hidden">
      <figure class="relative h-28 bg-base-100 overflow-hidden">
        {#if preview.image}
          <img src={preview.image} alt="preview" class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex flex-col items-center justify-center gap-1">
            <div class="text-2xl opacity-20"><ImageIcon /></div>
            <span class="text-[9px] uppercase tracking-wider text-base-content/15">Aperçu affiche</span>
          </div>
        {/if}

        <div class="absolute top-2 left-2">
          <span class="badge bg-base-100/80 backdrop-blur-sm border-primary/20 text-primary text-[9px] uppercase tracking-wider py-1.5 px-2">
            {preview.categoryEmoji} {preview.category || 'Catégorie'}
          </span>
        </div>
      </figure>

      <div class="p-3 flex flex-col gap-1.5">
        <p class="font-display text-sm font-bold text-base-content line-clamp-2 leading-snug">
          {preview.title || 'Titre de votre événement'}
        </p>

        <div class="flex items-center gap-1 text-base-content/35">
          <Calendar size={10} class="text-primary/50" />
          <span class="text-[10px]">{preview.date || 'Date à définir'}</span>
        </div>

        <div class="flex items-center gap-1 text-base-content/35">
          <MapPin size={10} class="text-primary/50" />
          <span class="text-[10px] truncate">{preview.location || 'Lieu à définir'}</span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-primary/8 mt-0.5">
          <span class="text-primary font-bold text-xs">{preview.price || '—'}</span>
          <span class="badge badge-outline border-primary/20 text-base-content/25 text-[9px] py-1">Brouillon</span>
        </div>
      </div>
    </div>
  </div>

  <nav class="flex-1 px-4 py-6 flex flex-col gap-1">
    {#each steps as step}
      {@const isDone = current > step.id}
      {@const isActive = current === step.id}

      <div class={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-primary/10 border border-primary/25'
          : isDone
            ? 'bg-primary/5 border border-primary/10'
            : 'border border-transparent'
      }`}>
        <div class={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
          isDone
            ? 'bg-primary text-primary-content'
            : isActive
              ? 'bg-primary text-primary-content shadow-md shadow-primary/40'
              : 'bg-base-300 border border-base-content/10 text-base-content/25'
        }`}>
          {#if isDone}
            <Check size={14} />
          {:else}
            <span>{step.id}</span>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <div class={`text-xs font-semibold uppercase tracking-wider ${
            isActive ? 'text-primary' : isDone ? 'text-base-content/60' : 'text-base-content/25'
          }`}>
            {step.label}
          </div>
          <div class={`text-[10px] mt-0.5 truncate ${isActive ? 'text-base-content/40' : 'text-base-content/20'}`}>
            {step.sublabel}
          </div>
        </div>

        {#if isActive}
          <span class="text-primary/50 shrink-0">
            <svelte:component this={step.icon} size={14} />
          </span>
        {/if}
      </div>
    {/each}
  </nav>
</aside>
