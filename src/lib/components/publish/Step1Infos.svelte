<script>
  import { createEventDispatcher } from "svelte";
  import { Info } from "lucide-svelte";

  export let data;
  /** @type {Array<{id: string, name: string, slug: string, icon?: string}>} */
  export let categories = [];
  export let loadingMeta = false;

  const dispatch = createEventDispatcher();

  let title = data.title;
  let description = data.description;

  $: title = data.title;
  $: description = data.description;
  $: charLeft = 2000 - description.length;

  function update(field, value) {
    dispatch("change", { field, value });
  }
</script>

<div class="flex flex-col gap-8">
  <div class="form-control flex flex-col w-full gap-2">
    <label class="label pb-0" for="">
      <span
        class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50"
      >
        Titre de l&apos;événement <span class="text-primary">*</span>
      </span>
      <span class="label-text-alt text-[10px] text-base-content/25"
        >{title.length}/80</span
      >
    </label>
    <input
      type="text"
      maxlength="80"
      bind:value={title}
      on:input={() => update("title", title)}
      placeholder="Ex : Festival de Jazz du Vieux-Port 2026"
      class="input input-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 text-sm rounded-xl h-12"
    />
    <p class="text-[11px] text-base-content/30 flex items-center gap-1.5">
      <Info size={11} class="text-primary/40 shrink-0" />
      Un titre clair et précis augmente la visibilité de votre événement.
    </p>
  </div>

  <div class="form-control gap-3">
    <label class="label pb-0" for="">
      <span
        class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50"
      >
        Catégorie <span class="text-primary">*</span>
      </span>
    </label>

    {#if loadingMeta}
      <div class="flex items-center gap-2 text-base-content/30 text-xs py-4">
        <span class="loading loading-spinner loading-xs"></span>
        Chargement des catégories…
      </div>
    {:else if categories.length === 0}
      <p class="text-xs text-base-content/30 py-2">
        Aucune catégorie disponible.
      </p>
    {:else}
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {#each categories as category}
          <button
            type="button"
            on:click={() => update("category", category.name)}
            class={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium ${
              data.category === category.name
                ? "border-primary bg-primary/12 text-primary"
                : "border-primary/10 bg-base-300 text-base-content/40 hover:border-primary/30 hover:text-base-content/70"
            }`}
          >
            {#if category.icon}
              <span class="text-base">{category.icon}</span>
            {/if}
            <span
              class="text-[10px] uppercase tracking-wide leading-none text-center"
              >{category.name}</span
            >
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="form-control flex flex-col w-full gap-2">
    <label class="label pb-0" for="">
      <span
        class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50"
      >
        Description <span class="text-primary">*</span>
      </span>
      <span
        class={`label-text-alt text-[10px] ${charLeft < 200 ? "text-warning" : "text-base-content/25"}`}
      >
        {charLeft} caractères restants
      </span>
    </label>
    <textarea
      rows="6"
      maxlength="2000"
      bind:value={description}
      on:input={() => update("description", description)}
      placeholder="Décrivez votre événement : programme, intervenants, ambiance, informations pratiques…"
      class="textarea textarea-bordered w-full bg-base-300 border-primary/15 focus:border-primary/50 text-sm rounded-xl resize-none leading-relaxed"
    ></textarea>
  </div>
</div>
