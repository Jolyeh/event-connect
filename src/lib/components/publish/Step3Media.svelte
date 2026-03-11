<script>
  import { createEventDispatcher } from 'svelte';
  import { Upload, X, ImageIcon, Trash2, Plus } from 'lucide-svelte';

  export let data;

  const dispatch = createEventDispatcher();

  let coverInput;
  let galleryInput;

  function update(field, value) {
    dispatch('change', { field, value });
  }

  function handleCoverChange(event) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => update('coverImage', e.target?.result || null);
    reader.readAsDataURL(file);
  }

  function handleGalleryChange(event) {
    const files = Array.from(event.currentTarget.files || []).slice(0, 4 - data.gallery.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        update('gallery', [...data.gallery, e.target?.result]);
      };
      reader.readAsDataURL(file);
    });
    event.currentTarget.value = '';
  }

  function removeGalleryImage(index) {
    update('gallery', data.gallery.filter((_, i) => i !== index));
  }
</script>

<div class="flex flex-col gap-8">
  <div class="form-control gap-3">
    <div class="flex items-center justify-between">
      <label class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50 flex items-center gap-2">
        <ImageIcon size={12} class="text-primary/50" />
        Affiche / Image principale <span class="text-primary ml-1">*</span>
      </label>
      {#if data.coverImage}
        <button
          type="button"
          on:click={() => update('coverImage', null)}
          class="btn btn-ghost btn-xs gap-1 text-error/60 hover:text-error rounded-full text-[10px]"
        >
          <Trash2 size={11} />
          Supprimer
        </button>
      {/if}
    </div>

    <input
      bind:this={coverInput}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      on:change={handleCoverChange}
      class="hidden"
    />

    {#if data.coverImage}
      <div class="relative rounded-2xl overflow-hidden border border-primary/20 group">
        <img src={data.coverImage} alt="Affiche" class="w-full h-56 object-cover" />
        <button
          type="button"
          on:click={() => coverInput?.click()}
          class="absolute inset-0 bg-base-100/0 hover:bg-base-100/60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
        >
          <div class="btn btn-primary btn-sm rounded-full gap-2 text-xs">
            <Upload size={13} />
            Changer l&apos;image
          </div>
        </button>
      </div>
    {:else}
      <button
        type="button"
        on:click={() => coverInput?.click()}
        class="border-2 border-dashed w-full border-primary/15 hover:border-primary/40 bg-base-300 hover:bg-primary/5 rounded-2xl p-10 flex flex-col items-center gap-3 transition-all duration-300 group"
      >
        <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <Upload size={22} class="text-primary/60" />
        </div>
        <div>
          <p class="text-sm font-medium text-base-content/40 text-center">Glissez votre affiche ici</p>
          <p class="text-[11px] text-base-content/25 text-center mt-1">JPG, PNG, WEBP · 1920×1080px recommandé · Max 2 Mo</p>
        </div>
        <span class="btn btn-outline btn-primary btn-sm rounded-full text-xs uppercase tracking-wider px-6">Parcourir</span>
      </button>
    {/if}
  </div>
  <!-- Galerie de photos -->
  <!-- <div class="divider divider-neutral opacity-40 my-0" ></div>

  <div class="form-control gap-3">
    <div class="flex items-center justify-between mb-2">
      <label class="label-text text-[10px] font-semibold uppercase tracking-[0.2em] text-base-content/50 flex items-center gap-2">
        <ImageIcon size={12} class="text-primary/50" />
        Galerie de photos
        <span class="badge badge-outline border-primary/20 text-base-content/30 text-[9px] py-1 px-2 ml-1">
          {data.gallery.length}/4
        </span>
      </label>
      {#if data.gallery.length < 4}
        <button
          type="button"
          on:click={() => galleryInput?.click()}
          class="btn btn-ghost btn-xs gap-1 text-primary/60 hover:text-primary rounded-full text-[10px]"
        >
          <Plus size={11} />
          Ajouter
        </button>
      {/if}
    </div>

    <input
      bind:this={galleryInput}
      type="file"
      accept="image/*"
      multiple
      on:change={handleGalleryChange}
      class="hidden"
    />

    <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {#each data.gallery as img, i (`${img.slice(0, 20)}-${i}`)}
        <div class="relative aspect-square rounded-xl overflow-hidden group border border-primary/10">
          <img src={img} alt="" class="w-full h-full object-cover" />
          <button
            type="button"
            on:click={() => removeGalleryImage(i)}
            class="absolute top-1 right-1 btn btn-circle btn-xs bg-base-100/80 border-0 text-error opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <X size={10} />
          </button>
        </div>
      {/each}
      {#if data.gallery.length < 10}
        <button
          type="button"
          on:click={() => galleryInput?.click()}
          class="aspect-square rounded-xl border-2 border-dashed border-primary/12 hover:border-primary/35 bg-base-300 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all duration-200"
        >
          <Plus size={18} class="text-base-content/20" />
          <span class="text-[9px] uppercase tracking-wider text-base-content/20">Ajouter</span>
        </button>
      {/if}
    </div>
  </div> -->
</div>
