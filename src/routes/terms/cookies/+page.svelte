<script>
  import { Check, ChevronDown, ChevronUp, Cookie } from "lucide-svelte";
  import LegalPage from "$lib/components/LegalPage.svelte";

  let expanded = null;

  let consents = {
    essential: true,
    analytics: false,
    marketing: false,
    preferences: true,
  };
  let saved = false;

  const cookieTypes = [
    {
      id: "essential",
      label: "Cookies essentiels",
      desc: "Indispensables au fonctionnement du service et à la sécurité des sessions.",
      required: true,
      cookies: [
        {
          name: "session_id",
          purpose: "Maintien de session",
          duration: "Session",
        },
        {
          name: "csrf_token",
          purpose: "Protection des formulaires",
          duration: "Session",
        },
        { name: "ev_auth", purpose: "Authentification", duration: "30 jours" },
      ],
    },
    {
      id: "analytics",
      label: "Cookies analytiques",
      desc: "Mesure d’usage et amélioration produit selon votre choix de stack.",
      required: false,
      cookies: [
        {
          name: "ev_analytics",
          purpose: "Mesure d’audience",
          duration: "13 mois",
        },
        { name: "ev_funnel", purpose: "Suivi de parcours", duration: "6 mois" },
      ],
    },
    {
      id: "preferences",
      label: "Cookies de préférences",
      desc: "Mémorisent le thème, la langue et certains filtres utiles.",
      required: false,
      cookies: [
        { name: "ev_theme", purpose: "Mode clair/sombre", duration: "12 mois" },
        {
          name: "ev_language",
          purpose: "Langue préférée",
          duration: "12 mois",
        },
        {
          name: "ev_filters",
          purpose: "Filtres sauvegardés",
          duration: "30 jours",
        },
      ],
    },
    {
      id: "marketing",
      label: "Cookies marketing",
      desc: "Utiles si vous activez le retargeting ou des campagnes sponsorisées.",
      required: false,
      cookies: [
        {
          name: "ev_ads",
          purpose: "Attribution campagne",
          duration: "90 jours",
        },
        {
          name: "ev_remarketing",
          purpose: "Segmentation publicitaire",
          duration: "90 jours",
        },
      ],
    },
  ];

  const sections = [
    {
      title: "Qu’est-ce qu’un cookie ?",
      paragraphs: [
        "Un cookie est un petit fichier stocké sur le terminal de l’utilisateur pour mémoriser certaines informations, maintenir une session ou mesurer l’usage du service.",
        "Dans un SaaS, les cookies peuvent être techniques, analytiques, de préférence ou marketing selon les outils réellement activés.",
      ],
    },
    {
      title: "Pourquoi cette politique a été revue",
      paragraphs: [
        "Le contenu a été simplifié et localisé pour un produit exploité au Bénin. Les références trop européennes ou trop spécifiques à des outils non utilisés ont été retirées.",
        "Avant déploiement, adaptez la liste des cookies à votre stack réelle, à votre bannière de consentement et à votre documentation conformité.",
      ],
    },
    {
      title: "Gestion des préférences",
      paragraphs: [
        "L’utilisateur doit pouvoir accepter, refuser ou paramétrer les cookies non essentiels selon votre implémentation réelle.",
        "Le panneau ci-dessous est une version front-only, sans persistance serveur ni stockage définitif.",
      ],
    },
    {
      title: "Cookies tiers",
      paragraphs: [
        "Si vous intégrez un prestataire d’analytics, de paiement, de chat client ou de publicité, documentez ici les dépôts éventuels réalisés par ces services.",
        "Ne conservez dans ce document que les partenaires réellement branchés à votre produit.",
      ],
    },
    {
      title: "Durée de conservation",
      paragraphs: [
        "Les durées doivent correspondre à vos paramètres techniques et à vos engagements internes. Les cookies de session expirent généralement à la fermeture du navigateur, tandis que d’autres ont une durée fixe limitée.",
      ],
    },
  ];

  function handleSave() {
    saved = true;
    setTimeout(() => {
      saved = false;
    }, 2500);
  }
</script>

<div>
  <LegalPage
    title="Politique de cookies"
    subtitle="Modèle de politique cookies pour un SaaS au Bénin, avec panneau de préférences local sans appel API."
    lastUpdated="9 mars 2026"
    {sections}
    relatedLinks={[
      { label: "Mentions légales", href: "/terms/mention" },
      { label: "Politique de confidentialité", href: "/terms/privacy" },
    ]}
  />

  <div class="max-w-4xl mx-auto px-4 sm:px-6 mt-4 pb-12">
    <div class="card bg-base-200 border border-primary/12 p-6">
      <div class="flex items-center gap-3 mb-5">
        <div
          class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <Cookie size={18} class="text-primary" />
        </div>
        <div>
          <h3 class="font-display text-base font-bold text-base-content">
            Gérer mes préférences
          </h3>
          <p class="text-[11px] text-base-content/35 mt-0.5">
            Version démo locale, à relier ensuite à votre vrai gestionnaire de
            consentement.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-2 mb-5">
        {#each cookieTypes as type}
          <div
            class={`card border overflow-hidden ${consents[type.id] ? "border-primary/18 bg-primary/4" : "border-primary/8 bg-base-300"}`}
          >
            <div class="p-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-base-content"
                      >{type.label}</span
                    >
                    {#if type.required}
                      <span
                        class="badge badge-outline border-primary/20 text-primary/50 text-[9px] py-1 uppercase tracking-wide"
                        >Requis</span
                      >
                    {/if}
                  </div>
                  <p class="text-[11px] text-base-content/38 mt-0.5">
                    {type.desc}
                  </p>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <button
                    on:click={() =>
                      (expanded = expanded === type.id ? null : type.id)}
                    class="btn btn-ghost btn-xs text-base-content/25 hover:text-primary rounded-full"
                  >
                    {#if expanded === type.id}
                      <ChevronUp size={14} />
                    {:else}
                      <ChevronDown size={14} />
                    {/if}
                  </button>
                  <input
                    type="checkbox"
                    class="toggle toggle-primary toggle-sm"
                    checked={consents[type.id]}
                    disabled={type.required}
                    on:change={(event) => {
                      const checked = event.currentTarget.checked;
                      consents = { ...consents, [type.id]: checked };
                    }}
                  />
                </div>
              </div>

              {#if expanded === type.id}
                <div
                  class="mt-3 pt-3 border-t border-primary/8 overflow-hidden"
                >
                  <div class="flex flex-col gap-1.5">
                    {#each type.cookies as cookie}
                      <div class="grid grid-cols-3 text-[11px] gap-2">
                        <code class="font-mono text-primary/70 truncate"
                          >{cookie.name}</code
                        >
                        <span class="text-base-content/40 truncate"
                          >{cookie.purpose}</span
                        >
                        <span class="text-base-content/30 text-right"
                          >{cookie.duration}</span
                        >
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex gap-3 flex-wrap">
        <button
          on:click={() =>
            (consents = {
              essential: true,
              analytics: false,
              marketing: false,
              preferences: false,
            })}
          class="btn btn-ghost btn-sm rounded-full border border-primary/15 hover:border-primary/35 text-xs uppercase tracking-wider text-base-content/40"
        >
          Refuser tout
        </button>
        <button
          on:click={() =>
            (consents = {
              essential: true,
              analytics: true,
              marketing: true,
              preferences: true,
            })}
          class="btn btn-ghost btn-sm rounded-full border border-primary/15 hover:border-primary/35 text-xs uppercase tracking-wider text-base-content/40"
        >
          Tout accepter
        </button>
        <button
          on:click={handleSave}
          class={`btn btn-sm rounded-full gap-2 text-xs uppercase tracking-wider font-semibold ml-auto shadow-md transition-all duration-300 ${saved ? "btn-success" : "btn-primary shadow-primary/20"}`}
        >
          {#if saved}
            <Check size={13} /> Préférences sauvegardées
          {:else}
            Enregistrer mes choix
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
