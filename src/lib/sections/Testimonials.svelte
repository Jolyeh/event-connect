<script>
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import { Star, Quote } from "lucide-svelte";
  import { reveal } from "$lib/actions/reveal";
  import { apiUrl, imageUrl } from "$lib/utils/api_url";
  import { onMount } from "svelte";

  let reviews = [];
  let average = null;
  let total = 0;
  let loading = true;

  async function loadReviews() {
    loading = true;
    try {
      const res = await fetch(`${apiUrl}/reviews`);
      const json = await res.json();
      if (json.status) {
        reviews = json.data ?? [];
        average = json.average;
        total = json.total ?? 0;
      }
    } catch {
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadReviews();
  });

  function imgSrc(path) {
    if (!path) return null;
    return path.startsWith("http") ? path : `${imageUrl}/${path}`;
  }

  function initials(u) {
    return `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();
  }
</script>

<section class="py-20 lg:py-32 bg-base-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader title="Ils nous font" titleAccent="confiance" centered />

    <!-- Résumé note globale -->
    {#if average && !loading}
      <div class="flex items-center justify-center gap-2 mb-10 -mt-4">
        <div class="flex gap-0.5">
          {#each Array(5) as _, i}
            <Star
              size={14}
              class={i < Math.round(average)
                ? "text-warning fill-warning"
                : "text-base-content/15"}
            />
          {/each}
        </div>
        <span class="text-sm font-bold text-base-content/60">{average}</span>
        <span class="text-xs text-base-content/25">({total} avis)</span>
      </div>
    {/if}

    <!-- Loader -->
    {#if loading}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        {#each Array(3) as _}
          <div class="skeleton h-56 rounded-2xl"></div>
        {/each}
      </div>

      <!-- Vide -->
    {:else if reviews.length === 0}
      <div class="text-center py-16">
        <Star size={28} class="text-base-content/10 mx-auto mb-3" />
        <p class="text-sm text-base-content/25">Aucun avis pour le moment.</p>
      </div>

      <!-- Grille -->
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        {#each reviews as r, i}
          <div
            use:reveal={{ delay: i * 200 }}
            class="card bg-base-200 border border-primary/8 hover:border-primary/25 p-6
                   transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 flex flex-col"
          >
            <!-- Quote -->
            <Quote
              size={28}
              class="text-primary/20 mb-4 shrink-0"
              fill="currentColor"
            />

            <!-- Étoiles -->
            <div class="flex gap-1 mb-4">
              {#each Array(5) as _, j}
                <Star
                  size={13}
                  class={j < r.rating
                    ? "text-warning fill-warning"
                    : "text-base-content/10"}
                />
              {/each}
            </div>

            <!-- Texte -->
            <p class="text-sm text-base-content/55 leading-relaxed flex-1 mb-6">
              &ldquo;{r.message}&rdquo;
            </p>

            <!-- Auteur -->
            <div class="flex items-center gap-3 pt-4 border-t border-primary/8">
              <div class="avatar">
                {#if imgSrc(r.user?.image)}
                  <div
                    class="w-10 rounded-full ring-2 ring-primary/20 ring-offset-1 ring-offset-base-200"
                  >
                    <img
                      src={imgSrc(r.user.image)}
                      alt={r.user.firstName}
                      width={40}
                      height={40}
                      class="rounded-full object-cover"
                    />
                  </div>
                {:else}
                  <div
                    class="w-10 h-10 rounded-full bg-primary/10 ring-2 ring-primary/20
                              flex items-center justify-center text-xs font-bold text-primary"
                  >
                    {initials(r.user)}
                  </div>
                {/if}
              </div>
              <div>
                <p class="text-sm font-semibold text-base-content">
                  {r.user.firstName}
                  {r.user.lastName}
                </p>
                <p class="text-[11px] text-base-content/35">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
