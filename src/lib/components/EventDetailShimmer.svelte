<div class="min-h-screen bg-base-100 pt-16">

  <!-- Hero image skeleton -->
  <div class="skeleton h-[50vh] sm:h-[55vh] lg:h-[65vh] w-full rounded-none"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col lg:flex-row gap-10">

      <!-- ── Colonne principale ──────────────────────────────────────────── -->
      <div class="flex-1 min-w-0">

        <!-- Étoiles -->
        <div class="flex items-center gap-1.5 mb-4">
          {#each Array(5) as _}
            <div class="skeleton w-3.5 h-3.5 rounded-sm"></div>
          {/each}
          <div class="skeleton h-3 w-24 rounded-full ml-2"></div>
        </div>

        <!-- Titre -->
        <div class="mb-6 space-y-3">
          <div class="skeleton h-9 w-3/4 rounded-xl"></div>
          <div class="skeleton h-9 w-1/2 rounded-xl"></div>
          <div class="skeleton h-5 w-1/3 rounded-lg mt-2"></div>
        </div>

        <!-- Grille meta 4 blocs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {#each Array(4) as _}
            <div class="skeleton h-16 rounded-xl"></div>
          {/each}
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 border-b border-base-300 mb-6">
          {#each [80, 72, 56] as w}
            <div class="skeleton h-9 rounded-t-lg" style="width:{w}px"></div>
          {/each}
        </div>

        <!-- Corps texte -->
        <div class="space-y-2.5 mb-6">
          {#each [100, 96, 90, 75] as p}
            <div class="skeleton h-4 rounded" style="width:{p}%"></div>
          {/each}
        </div>

        <!-- Tags -->
        <div class="flex gap-2 mb-10">
          {#each Array(4) as _}
            <div class="skeleton h-6 w-16 rounded-full"></div>
          {/each}
        </div>

        <!-- Card organisateur -->
        <div class="card bg-base-200 border border-base-300 p-6 mb-10">
          <div class="skeleton h-3 w-20 rounded mb-5"></div>
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="skeleton w-14 h-14 rounded-2xl shrink-0"></div>
              <div class="space-y-2">
                <div class="skeleton h-4 w-32 rounded"></div>
                <div class="skeleton h-3 w-24 rounded"></div>
              </div>
            </div>
            <div class="skeleton h-9 w-28 rounded-full"></div>
          </div>
        </div>

        <!-- Titre similar -->
        <div class="skeleton h-7 w-52 rounded-xl mb-6"></div>

        <!-- Cards similaires -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {#each Array(4) as _}
            <div class="card bg-base-200 border border-base-300 overflow-hidden">
              <div class="skeleton h-32 rounded-none"></div>
              <div class="p-4 space-y-2">
                <div class="skeleton h-3 w-14 rounded-full"></div>
                <div class="skeleton h-4 w-full rounded"></div>
                <div class="skeleton h-3 w-3/4 rounded"></div>
              </div>
            </div>
          {/each}
        </div>

      </div>

      <!-- ── Panneau billetterie ──────────────────────────────────────────── -->
      <div class="w-full lg:w-[380px] shrink-0">
        <div class="card bg-base-200 border border-base-300 sticky top-24 p-6 space-y-5">

          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="skeleton w-4 h-4 rounded"></div>
              <div class="skeleton h-5 w-24 rounded"></div>
            </div>
            <div class="skeleton h-4 w-20 rounded-full"></div>
          </div>

          <!-- Date -->
          <div class="skeleton h-14 w-full rounded-xl"></div>

          <!-- Tickets -->
          {#each Array(2) as _}
            <div class="skeleton h-14 w-full rounded-xl"></div>
          {/each}

          <!-- Quantité -->
          <div class="space-y-2">
            <div class="skeleton h-3 w-16 rounded"></div>
            <div class="flex items-center gap-3">
              <div class="skeleton w-8 h-8 rounded-full"></div>
              <div class="skeleton w-8 h-5 rounded"></div>
              <div class="skeleton w-8 h-8 rounded-full"></div>
            </div>
          </div>

          <!-- Résumé prix -->
          <div class="skeleton h-24 w-full rounded-xl"></div>

          <!-- Bouton CTA -->
          <div class="skeleton h-12 w-full rounded-xl"></div>

          <!-- Sécurité -->
          <div class="skeleton h-3 w-32 rounded mx-auto"></div>

        </div>
      </div>

    </div>
  </div>
</div>