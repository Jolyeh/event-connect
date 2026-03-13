<script>
  import { appName } from "$lib";
  import { reveal } from "$lib/actions/reveal";
  import { ArrowRight, BarChart2, Users, Zap, Shield } from "lucide-svelte";

  const perks = [
    { Icon: BarChart2, label: "Analytics temps réel" },
    { Icon: Users, label: "850K+ participants" },
    { Icon: Zap, label: "Commission 5% seulement" },
    { Icon: Shield, label: "Paiements sécurisés" },
  ];
</script>

<section id="organisateurs" class="py-20 lg:py-32 bg-base-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
      use:reveal
      class="card lg:card-side bg-base-300 border border-primary/15 overflow-hidden hover:border-primary/30 transition-colors duration-300 min-h-[420px]"
    >
      <!-- Image -->
      <figure
        use:reveal={{ delay: 80 }}
        class="relative lg:w-[45%] h-64 lg:h-auto overflow-hidden shrink-0"
      >
        <img
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
          alt="Organisateur d'événements"
          class="object-cover"
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
        <div
          class="absolute inset-0 bg-linear-to-r from-transparent to-base-300/50 hidden lg:block"
        ></div>

        <!-- Floating stat card  -->
        <div
          use:reveal={{ delay: 180 }}
          class="absolute bottom-5 left-5 z-10 w-fit h-fit flex flex-col items-start card bg-base-100/90 backdrop-blur-md border border-primary/20 p-4 shadow-2xl"
        >
          <div
            class="text-[9px] uppercase tracking-widest text-base-content/35 mb-1 leading-none"
          >
            Revenus ce mois
          </div>
          <div
            class="font-display text-2xl font-bold text-primary leading-tight"
          >
            +12 400FCFA
          </div>
        </div>
      </figure>

      <!-- Content -->
      <div class="card-body lg:w-[55%] p-8 lg:p-12 justify-center gap-6">
        <div use:reveal={{ delay: 120 }}>
          <p
            class="text-[10px] uppercase tracking-[0.28em] text-primary mb-3 font-semibold"
          >
            Pour les organisateurs
          </p>
          <h2
            class="font-display font-bold text-base-content leading-tight mb-4"
            style="font-size: clamp(1.75rem, 3.5vw, 2.8rem)"
          >
            Publiez vos événements,
            <br />
            <span class="italic font-light text-primary"
              >touchez des milliers.</span
            >
          </h2>
          <p class="text-sm text-base-content/45 leading-relaxed max-w-lg">
            Rejoignez la communautés organisateurs qui font confiance à {appName}
            pour vendre leurs billets, gérer leurs événements et analyser leurs performances.
          </p>
        </div>

        <!-- Perks -->
        <div class="flex flex-wrap gap-2">
          {#each perks as perk, i}
            <div
              use:reveal={{ delay: 180 + i * 80 }}
              class="flex items-center gap-2 border border-primary/18 bg-primary/6 text-base-content/55 text-xs px-3 py-2 rounded-full"
            >
              <perk.Icon size={12} class="text-primary" />
              {perk.label}
            </div>
          {/each}
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3" use:reveal={{ delay: 260 }}>
          <a
            href="/auth/register"
            class="btn btn-primary rounded-2xl gap-2 text-xs uppercase tracking-widest font-semibold px-8 shadow-xl shadow-primary/25"
          >
            Devenir organisateur
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
