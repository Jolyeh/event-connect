<script lang="ts">
  import { ChevronRight, Scale } from 'lucide-svelte';
  import { company } from '$lib/index';

  export let title: string;
  export let subtitle: string;
  export let lastUpdated: string;
  export let sections = [];
  export let relatedLinks = [];
</script>

<div class="min-h-screen bg-base-100 pt-[68px]">
  <div class="bg-base-200 border-b border-primary/10 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Scale size={18} class="text-primary" />
        </div>
        <div class="flex items-center gap-2 text-[10px] uppercase tracking-wider text-base-content/35">
          <a href="/" class="hover:text-primary transition-colors">Accueil</a>
          <ChevronRight size={10} />
          <span>{title}</span>
        </div>
      </div>
      <h1 class="font-display font-bold text-base-content mb-2" style="font-size: clamp(1.8rem, 4vw, 2.5rem)">{title}</h1>
      <p class="text-sm text-base-content/45 max-w-3xl">{subtitle}</p>
      <div class="inline-flex items-center gap-2 mt-3 bg-base-300 border border-primary/10 rounded-full px-4 py-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
        <span class="text-[10px] uppercase tracking-wider text-base-content/35">Mise à jour : {lastUpdated}</span>
      </div>
    </div>
  </div>

  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
      <aside class="hidden lg:block">
        <div class="sticky top-24 card bg-base-200 border border-primary/8 p-5">
          <h3 class="text-[10px] uppercase tracking-[0.22em] text-base-content/35 mb-4">Sommaire</h3>
          <nav class="flex flex-col gap-1">
            {#each sections as section, i}
              <a href={`#section-${i}`} class="flex items-center gap-2 py-1.5 text-[11px] text-base-content/40 hover:text-primary transition-colors group">
                <span class="text-primary/30 font-mono font-bold text-[9px] group-hover:text-primary transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.title}
              </a>
            {/each}
          </nav>

          {#if relatedLinks.length > 0}
            <div class="mt-6 pt-5 border-t border-primary/8">
              <h3 class="text-[10px] uppercase tracking-[0.22em] text-base-content/28 mb-3">Voir aussi</h3>
              <div class="flex flex-col">
                {#each relatedLinks as link}
                  <a href={link.href} class="flex items-center gap-1.5 py-1 text-[11px] text-primary/60 hover:text-primary transition-colors">
                    <ChevronRight size={10} /> {link.label}
                  </a>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </aside>

      <div class="lg:col-span-3 flex flex-col gap-8">
        {#each sections as section, i}
          <section id={`section-${i}`} class="scroll-mt-24">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] font-bold text-primary/40">{String(i + 1).padStart(2, '0')}</span>
                <div class="w-px h-5 bg-primary/20"></div>
              </div>
              <h2 class="font-display text-lg font-bold text-base-content">{section.title}</h2>
            </div>

            <div class="pl-7 space-y-4 text-sm text-base-content/55 leading-relaxed">
              {#if section.paragraphs}
                {#each section.paragraphs as paragraph}
                  <p>{paragraph}</p>
                {/each}
              {/if}

              {#if section.definitions}
                <div class="grid gap-3">
                  {#each section.definitions as definition}
                    <div class="flex gap-3 bg-base-200 border border-primary/8 rounded-xl p-3">
                      <span class="text-primary font-bold text-xs shrink-0 w-28">{definition.term}</span>
                      <span class="text-xs text-base-content/60">{definition.def}</span>
                    </div>
                  {/each}
                </div>
              {/if}

              {#if section.cards}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {#each section.cards as card}
                    <div class="bg-base-200 border border-primary/8 rounded-xl p-3">
                      {#if card.label}
                        <div class="text-[10px] uppercase tracking-wider text-primary/60 mb-1">{card.label}</div>
                      {/if}
                      {#if card.title}
                        <div class="text-sm font-semibold text-base-content/80">{card.title}</div>
                      {/if}
                      {#if card.value}
                        <div class="text-sm text-base-content">{card.value}</div>
                      {/if}
                      {#if card.desc}
                        <div class="text-xs text-base-content/45 mt-1">{card.desc}</div>
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}

              {#if section.bullets}
                <ul class="space-y-2">
                  {#each section.bullets as bullet}
                    <li class="flex items-start gap-2.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0"></div>
                      <span>{bullet}</span>
                    </li>
                  {/each}
                </ul>
              {/if}

              {#if section.note}
                <div class="rounded-xl border border-warning/20 bg-warning/5 p-4 text-xs text-base-content/60">
                  {section.note}
                </div>
              {/if}
            </div>
          </section>
        {/each}

        <div class="card bg-primary/6 border border-primary/15 p-5 mt-4">
          <p class="text-xs text-base-content/45 leading-relaxed">
            Ce modèle a été adapté pour un SaaS opéré au Bénin. Avant mise en production, complètez vos informations légales
            (RCCM, IFU, siège, prestataire de paiement, hébergement et procédures internes) et faites relire le document par un conseil juridique.
            Contact : <a href={`mailto:${company.legalEmail}`} class="text-primary hover:underline">{company.legalEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
