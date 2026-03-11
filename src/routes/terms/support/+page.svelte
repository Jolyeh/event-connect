<script>
  import {
    ArrowRight,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    HelpCircle,
    Mail,
    MessageCircle,
    Phone,
    Search,
    Shield,
    Ticket,
    Users,
    CreditCard,
  } from "lucide-svelte";
  import { company } from "$lib/index";


  const categories = [
    { id: "compte", label: "Compte & profil", icon: Users },
    { id: "billets", label: "Billets", icon: Ticket },
    { id: "paiement", label: "Paiement", icon: CreditCard },
    { id: "securite", label: "Sécurité", icon: Shield },
    { id: "organisateur", label: "Organisateur", icon: MessageCircle },
    { id: "autre", label: "Autre", icon: HelpCircle },
  ];

  const contactOptions = [
    {
      label: "Support e-mail",
      desc: company.email,
      action: "Envoyer un e-mail",
      time: "Réponse sous 24h ouvrées",
    },
    {
      label: "Téléphone",
      desc: company.phone,
      action: "Appeler",
      time: "Lun–Ven 8h30–18h30",
    },
    {
      label: "WhatsApp Business",
      desc: "+229 01 97 00 00 00",
      action: "Écrire sur WhatsApp",
      time: "Assistance rapide",
    },
  ];

  const faqs = [
    {
      cat: "billets",
      q: "Comment reçois-je mes billets après paiement ?",
      a: "Les billets sont générés instantanément dans votre espace et peuvent aussi être envoyés par e-mail. Dans cette version Svelte, la confirmation est simulée localement sans passerelle de paiement.",
    },
    {
      cat: "billets",
      q: "Puis-je transférer un billet à une autre personne ?",
      a: "Oui, selon les règles définies par l’organisateur. Le transfert peut être activé depuis le tableau de bord client ou traité par le support.",
    },
    {
      cat: "paiement",
      q: "Quels moyens de paiement conviennent au marché béninois ?",
      a: "Le copy a été revu pour un SaaS local : Mobile Money, cartes bancaires régionales et autres moyens acceptés par votre prestataire de paiement.",
    },
    {
      cat: "paiement",
      q: "Les prix sont affichés dans quelle devise ?",
      a: "La maquette utilise le franc CFA (FCFA / XOF) afin de mieux correspondre à un produit commercialisé au Bénin.",
    },
    {
      cat: "compte",
      q: "Comment supprimer un compte client ?",
      a: "La demande peut être gérée depuis l’espace profil. Avant suppression, pensez à exporter vos justificatifs et l’historique utile.",
    },
    {
      cat: "organisateur",
      q: "Comment publier un premier événement ?",
      a: "Un organisateur remplit ses informations, configure ses billets puis publie. Dans cette version sans API, la publication est simulée par des données locales.",
    },
    {
      cat: "organisateur",
      q: "Quand les ventes sont-elles reversées ?",
      a: "Le texte a été adapté à une logique SaaS locale. Les délais exacts de reversement doivent être définis dans vos CGU et alignés avec votre prestataire de paiement.",
    },
    {
      cat: "securite",
      q: "Comment sont protégées les données personnelles ?",
      a: "Les textes mentionnent désormais la conformité au cadre applicable au Bénin, notamment la protection des données et la gouvernance interne à préciser avant mise en production.",
    },
  ];

  let query = "";
  let activeCategory = "tous";
  let openFaq = null;
  let formSent = false;
  let formData = { name: "", email: "", subject: "", message: "" };

  $: filteredFaqs = faqs.filter((faq) => {
    const matchCat = activeCategory === "tous" || faq.cat === activeCategory;
    const q = query.trim().toLowerCase();
    const matchQ =
      !q || faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  function handleSubmit(event) {
    event.preventDefault();
    formSent = true;
  }
</script>

<div class="min-h-screen bg-base-100 pt-[68px]">
  <div
    class="relative bg-base-200 border-b border-primary/10 py-16 px-4 overflow-hidden text-center"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-primary/6 to-transparent"
    ></div>
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/8 rounded-full blur-3xl"
    ></div>
    <div class="relative z-10">
      <div
        class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5"
      >
        <HelpCircle size={26} class="text-primary" />
      </div>
      <h1
        class="font-display font-bold text-base-content mb-2"
        style="font-size: clamp(1.8rem, 4vw, 2.8rem)"
      >
        Centre d’<span class="italic font-light text-primary">aide</span>
      </h1>
      <p class="text-sm text-base-content/45 mb-7 max-w-2xl mx-auto">
        Le contenu a été revu pour une plateforme SaaS opérée au Bénin :
        terminologie locale, support client simple et promesses réalistes.
      </p>

      <div class="relative max-w-lg mx-auto">
        <Search
          size={16}
          class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 pointer-events-none"
        />
        <input
          type="text"
          bind:value={query}
          placeholder="Rechercher dans l'aide..."
          class="input input-bordered w-full pl-11 bg-base-300 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-12 placeholder:text-base-content/22"
        />
      </div>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
      {#each categories as category}
        <button
          on:click={() =>
            (activeCategory =
              activeCategory === category.id ? "tous" : category.id)}
          class={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200 ${
            activeCategory === category.id
              ? "bg-primary/12 border-primary/30 text-primary shadow-md shadow-primary/10"
              : "bg-base-200 border-primary/8 text-base-content/45 hover:border-primary/25 hover:text-primary"
          }`}
        >
          <svelte:component
            this={category.icon}
            size={20}
            class={activeCategory === category.id
              ? "text-primary"
              : "text-base-content/30"}
          />
          <span
            class="text-[10px] uppercase tracking-wide font-semibold leading-tight"
            >{category.label}</span
          >
        </button>
      {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-display text-2xl font-bold text-base-content">
            Questions <span class="italic font-light text-primary"
              >fréquentes</span
            >
          </h2>
          <button
            on:click={() => (activeCategory = "tous")}
            class={`text-[10px] uppercase tracking-wider text-primary/60 hover:text-primary transition-colors ${activeCategory === "tous" ? "opacity-0 pointer-events-none" : ""}`}
          >
            Tout afficher
          </button>
        </div>

        <div class="flex flex-col gap-2">
          {#if filteredFaqs.length === 0}
            <div class="text-center py-12">
              <p class="text-sm text-base-content/30">
                Aucune question trouvée pour “{query}”
              </p>
            </div>
          {:else}
            {#each filteredFaqs as faq, i}
              <div
                class={`card bg-base-200 border overflow-hidden transition-all duration-200 ${openFaq === i ? "border-primary/25 shadow-md shadow-primary/8" : "border-primary/8 hover:border-primary/20"}`}
              >
                <button
                  on:click={() => (openFaq = openFaq === i ? null : i)}
                  class="w-full p-5 flex items-start gap-4 text-left"
                >
                  <div
                    class={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${openFaq === i ? "bg-primary border-primary" : "border-primary/20"}`}
                  >
                    {#if openFaq === i}
                      <ChevronUp size={11} class="text-primary-content" />
                    {:else}
                      <ChevronDown size={11} class="text-primary/40" />
                    {/if}
                  </div>
                  <span
                    class={`text-sm font-semibold leading-snug transition-colors duration-200 ${openFaq === i ? "text-primary" : "text-base-content"}`}
                  >
                    {faq.q}
                  </span>
                </button>
                {#if openFaq === i}
                  <div
                    class="px-5 pb-5 pl-14 text-sm text-base-content/50 leading-relaxed"
                  >
                    {faq.a}
                  </div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div class="card bg-base-200 border border-primary/8 p-5">
          <h3 class="font-display text-lg font-bold text-base-content mb-4">
            Nous <span class="italic font-light text-primary">contacter</span>
          </h3>
          <div class="flex flex-col gap-3">
            {#each contactOptions as option, index}
              <div
                class="flex gap-3 p-3 bg-base-300 border border-primary/6 hover:border-primary/20 rounded-xl cursor-pointer transition-all duration-200 group"
              >
                <div
                  class="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0"
                >
                  {#if index === 0}
                    <Mail size={16} class="text-primary" />
                  {:else if index === 1}
                    <Phone size={16} class="text-primary" />
                  {:else}
                    <MessageCircle size={16} class="text-primary" />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-xs font-semibold text-base-content group-hover:text-primary transition-colors"
                  >
                    {option.label}
                  </div>
                  <div class="text-[10px] text-base-content/35 mt-0.5">
                    {option.desc}
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <Clock size={9} class="text-base-content/20" />
                    <span class="text-[10px] text-base-content/25"
                      >{option.time}</span
                    >
                  </div>
                </div>
                <ArrowRight
                  size={13}
                  class="text-base-content/15 group-hover:text-primary transition-colors shrink-0 self-center"
                />
              </div>
            {/each}
          </div>
        </div>

        <div class="card bg-base-200 border border-primary/8 p-5">
          <h3 class="font-display text-lg font-bold text-base-content mb-4">
            Formulaire de <span class="italic font-light text-primary"
              >contact</span
            >
          </h3>

          {#if formSent}
            <div class="flex flex-col items-center py-6 text-center">
              <div
                class="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-3"
              >
                <CheckCircle size={22} class="text-success" />
              </div>
              <p class="text-sm font-semibold text-base-content mb-1">
                Message enregistré
              </p>
              <p class="text-xs text-base-content/40 leading-relaxed">
                La soumission est locale. Branche ici ton backend ou ton outil
                de support.
              </p>
            </div>
          {:else}
            <form on:submit={handleSubmit} class="flex flex-col gap-3">
              <input
                bind:value={formData.name}
                placeholder="Nom complet"
                class="input input-bordered bg-base-300 border-primary/15"
              />
              <input
                bind:value={formData.email}
                placeholder="Adresse e-mail"
                class="input input-bordered bg-base-300 border-primary/15"
              />
              <input
                bind:value={formData.subject}
                placeholder="Sujet"
                class="input input-bordered bg-base-300 border-primary/15"
              />
              <textarea
                bind:value={formData.message}
                placeholder="Explique ton besoin"
                class="textarea textarea-bordered min-h-32 bg-base-300 border-primary/15"
              ></textarea>
              <button
                type="submit"
                class="btn btn-primary rounded-xl text-xs uppercase tracking-wider"
                >Envoyer</button
              >
            </form>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
