<script>
  import { ArrowUpRight } from "lucide-svelte";
  import { reveal } from "$lib/actions/reveal";
  import { apiUrl, imageUrl } from "$lib/utils/api_url";

  /** @type {Array} */
  let categories = [];

  async function loadCategories() {
    try {
      const res = await fetch(`${apiUrl}/categories`);
      const json = await res.json();
      categories = (json.data ?? json.categories ?? []).slice(0, 5);
    } catch {
      categories = [];
    }
  }

  loadCategories();

  function imgSrc(icon) {
    if (!icon) return null;
    if (icon.startsWith("http")) return icon;
    return `${imageUrl}/${icon}`;
  }
</script>

<section class="py-20 lg:py-32 bg-base-100" id="categories">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Header -->
    <div use:reveal class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">Explorer</p>
        <h2 class="font-bold text-base-content leading-tight" style="font-size: clamp(1.8rem, 3vw, 2.6rem)">
          Toutes les <em class="font-light text-primary not-italic">catégories</em>
        </h2>
      </div>
      <a
        href="/event/categories"
        class="btn btn-outline btn-primary rounded-full gap-2 text-xs uppercase tracking-widest self-start lg:self-auto shrink-0"
      >
        Voir tous <ArrowUpRight size={14} />
      </a>
    </div>

    <!-- Grille masonry -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {#each categories as cat, i (cat.id ?? cat.slug)}
        <a
          href={`event/categories/${cat.slug}`}
          use:reveal={{ delay: i * 100 }}
          class="group relative rounded-2xl overflow-hidden cursor-pointer
                 hover:scale-[1.02] transition-transform duration-300
                 {i === 0 ? 'col-span-2 row-span-2 h-[340px] lg:h-[380px]' : 'col-span-1 h-40 lg:h-[180px]'}"
        >
          <!-- Image -->
          {#if imgSrc(cat.icon)}
            <img
              src={imgSrc(cat.icon)}
              alt={cat.name}
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          {:else}
            <div class="absolute inset-0 bg-linear-to-br from-primary/20 via-base-300 to-base-200"></div>
            <span class="absolute inset-0 flex items-center justify-center text-5xl font-black text-primary/10 select-none pointer-events-none">
              {cat.name?.slice(0, 2).toUpperCase()}
            </span>
          {/if}

          <!-- Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-base-100/90 via-base-100/20 to-transparent"></div>

          <!-- Bouton flèche (visible au hover) -->
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div class="btn btn-primary btn-circle btn-xs shadow-lg">
              <ArrowUpRight size={11} />
            </div>
          </div>

          <!-- Texte bas -->
          <div class="absolute bottom-4 left-4">
            <p class="font-bold text-base-content {i === 0 ? 'text-base lg:text-lg' : 'text-sm'} leading-tight">
              {cat.name}
            </p>
            <p class="text-[10px] uppercase tracking-wider text-base-content/40 mt-0.5">
              {cat._count?.events ?? cat.count ?? 0} événements
            </p>
          </div>
        </a>
      {/each}

    </div>
  </div>
</section>
