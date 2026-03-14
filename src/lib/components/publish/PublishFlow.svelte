<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import {
    FileText,
    CalendarDays,
    Image as ImageIcon,
    Ticket,
    Settings,
    ArrowLeft,
    ArrowRight,
    Send,
    ChevronRight,
    AlertCircle,
  } from "lucide-svelte";

  import StepSidebar from "./StepSidebar.svelte";
  import Step1Infos from "./Step1Infos.svelte";
  import Step2DateTime from "./Step2DateTime.svelte";
  import Step3Media from "./Step3Media.svelte";
  import Step4Tickets from "./Step4Tickets.svelte";
  import Step5Options from "./Step5Options.svelte";
  import SuccessScreen from "./SuccessScreen.svelte";

  import { INITIAL_FORM } from "./types.js";
  import { apiUrl } from "$lib/utils/api_url";
  import { createEventSchema } from "$lib/validations/event";

  const dispatch = createEventDispatcher();

  let step = 1;
  let data = { ...INITIAL_FORM };
  let submitted = false;
  let submitting = false;
  let submitError = "";

  /** @type {Array<{id: string, name: string, slug: string, icon?: string}>} */
  let categories = [];
  /** @type {Array<{id: string, name: string, slug: string}>} */
  let tags = [];
  let loadingMeta = true;

  const STEPS = [
    {
      id: 1,
      label: "Informations",
      sublabel: "Titre, catégorie, description",
      icon: FileText,
    },
    {
      id: 2,
      label: "Date & Lieu",
      sublabel: "Quand et où",
      icon: CalendarDays,
    },
    { id: 3, label: "Médias", sublabel: "Affiche et photos", icon: ImageIcon },
    {
      id: 4,
      label: "Billetterie",
      sublabel: "Prix et catégories",
      icon: Ticket,
    },
    {
      id: 5,
      label: "Options",
      sublabel: "Visibilité et extras",
      icon: Settings,
    },
  ];

  // Chargement des catégories et tags depuis l'API au montage
  async function loadMeta() {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch(`${apiUrl}/categories`),
        //fetch(`${apiUrl}/tags`),
      ]);

      const catJson = await catRes.json();
      //const tagJson = await tagRes.json();
      if (catJson.status) categories = catJson.data ?? [];
      //if (tagJson.status) tags = tagJson.data ?? [];
    } catch (e) {
      console.error("[LOAD_META]", e);
    } finally {
      loadingMeta = false;
    }
  }

  onMount(() => {
    loadMeta();
  });

  function getProgress(currentStep) {
    return Math.round((currentStep / STEPS.length) * 100);
  }

  function formatPreviewDate(dateStart, timeStart) {
    if (!dateStart) return "";
    try {
      const d = new Date(dateStart);
      const day = d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
      return timeStart ? `${day} · ${timeStart}` : day;
    } catch {
      return dateStart;
    }
  }

  function getMinPrice(isFree, tickets) {
    if (isFree) return "Gratuit";
    if (!tickets.length) return "—";
    const prices = tickets
      .map((t) => parseFloat(t.price))
      .filter((p) => !Number.isNaN(p));
    if (!prices.length) return "—";
    const min = Math.min(...prices);
    return `À partir de ${min.toFixed(2).replace(".00", "")}FCFA`;
  }

  function handleChange(field, value) {
    data = { ...data, [field]: value };
  }

  function handleChildChange(event) {
    handleChange(event.detail.field, event.detail.value);
  }

  $: canGoNext = (() => {
    if (step === 1)
      return (
        data.title.length >= 3 &&
        !!data.category &&
        data.description.length >= 10
      );
    if (step === 2)
      return (
        !!data.dateStart &&
        !!data.timeStart &&
        (data.isOnline ? !!data.onlineUrl : !!data.venue && !!data.city)
      );
    if (step === 3) return !!data.coverImage;
    if (step === 4) return data.isFree || data.tickets.length > 0;
    return true;
  })();

  /** Convertit un base64 dataURL en File uploadable */
  function base64ToFile(dataUrl, filename) {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return new File([buffer], filename, { type: mime });
  }

  /** Résout categoryId depuis le nom sélectionné (insensible à la casse) */
  function resolveCategoryId(categoryName) {
    return (
      categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
      )?.id ?? null
    );
  }

  async function handleSubmit() {
    try {
      submitting = true;
      submitError = "";

      const parsed = createEventSchema.safeParse(data);

      /* if (!parsed.success) {
        submitError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
        return;
      } */

      // Résolution de categoryId
      const categoryId = resolveCategoryId(data.category);
      if (!categoryId) {
        submitError =
          "Catégorie introuvable. Veuillez en sélectionner une valide.";
        return;
      }

      // Construction FormData (multipart pour l'image)
      const formData = new FormData();

      // Image principale obligatoire (base64 → File)
      if (!data.coverImage) {
        submitError = "L'image principale est requise.";
        return;
      }
      formData.append(
        "coverImage",
        base64ToFile(data.coverImage, `cover-${Date.now()}.jpg`),
      );

      // Champs scalaires
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("categoryId", categoryId);
      formData.append("dateStart", data.dateStart);
      formData.append("multiDay", String(data.multiDay));
      formData.append("isOnline", String(data.isOnline));
      formData.append("isFree", String(data.isFree));

      if (data.timeStart) formData.append("timeStart", data.timeStart);
      if (data.dateEnd) formData.append("dateEnd", data.dateEnd);
      if (data.timeEnd) formData.append("timeEnd", data.timeEnd);
      if (data.onlineUrl) formData.append("onlineUrl", data.onlineUrl);
      if (data.venue) formData.append("venue", data.venue);
      if (data.address) formData.append("address", data.address);
      if (data.city) formData.append("city", data.city);
      if (data.capacity)
        formData.append("capacity", String(parseInt(data.capacity)));
      if (data.saleStart) formData.append("saleStart", data.saleStart);
      if (data.saleEnd) formData.append("saleEnd", data.saleEnd);
      if (data.ageRestriction)
        formData.append("ageRestriction", data.ageRestriction);
      if (data.contactEmail) formData.append("contactEmail", data.contactEmail);
      if (data.website) formData.append("website", data.website);

      // Tableaux en JSON
      // tagNames : le back fait l'upsert automatique (insensible à la casse)
      formData.append("tagNames", JSON.stringify(data.tags));
      formData.append(
        "tickets",
        JSON.stringify(
          data.tickets.map((t) => ({
            name: t.name,
            description: t.description || undefined,
            price: Math.round(parseFloat(t.price) * 100), // centimes
            quantity: parseInt(t.quantity),
          })),
        ),
      );
      formData.append("gallery", JSON.stringify([]));

      // Envoi avec cookie JWT
      const res = await fetch(`${apiUrl}/events`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();

      if (!json.status) {
        submitError = json.message ?? "Une erreur est survenue.";
        return;
      }

      submitted = true;
      dispatch("submit", json.data);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("[SUBMIT_EVENT]", error);
      submitError = "Erreur réseau. Vérifiez votre connexion et réessayez.";
    } finally {
      submitting = false;
    }
  }

  $: preview = {
    title: data.title,
    category: data.category,
    categoryEmoji: data.categoryEmoji,
    date: formatPreviewDate(data.dateStart, data.timeStart),
    location: data.isOnline ? "En ligne" : data.venue || data.city,
    price: getMinPrice(data.isFree, data.tickets),
    image: data.coverImage,
  };

  $: stepStatus = STEPS.map((item) => {
    if (item.id < step) return "done";
    if (item.id === step) return "active";
    return "locked";
  });
</script>

<div class="min-h-screen bg-base-100 pt-[68px]">
  {#if submitted}
    <div class="max-w-2xl mx-auto px-4 py-12">
      <SuccessScreen />
    </div>
  {:else}
    <div class="flex min-h-[calc(100vh-68px)]">
      <StepSidebar
        steps={STEPS}
        current={step}
        progress={getProgress(step)}
        {preview}
      />

      <div class="flex-1 flex flex-col">
        <div
          class="lg:hidden bg-base-200 border-b border-primary/10 px-4 py-3 w-full"
        >
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold"
              >Étape {step}/{STEPS.length}</span
            >
            <span
              class="text-[10px] uppercase tracking-wider text-base-content/25"
              >{getProgress(step)}%</span
            >
          </div>

          <div class="h-1 bg-base-300 rounded-full overflow-hidden">
            <div
              class="h-full bg-linear-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={`width:${getProgress(step)}%`}
            ></div>
          </div>

          <div class="flex w-full gap-1 mt-4">
            {#each STEPS as item}
              {@const status = stepStatus[item.id - 1]}
              {@const isActive = status === "active"}
              <div
                class={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-300 flex-1 min-w-0 ${
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-primary"
                    : "bg-transparent text-base-content/20"
                }`}
              >
                <span
                  class={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                    status === "done"
                      ? "bg-primary text-primary-content"
                      : isActive
                        ? "bg-primary text-primary-content shadow-sm"
                        : "bg-base-300 text-base-content/30"
                  }`}
                >
                  {status === "done" ? "✓" : item.id}
                </span>
                <span
                  class={`text-[9px] uppercase font-bold truncate ${isActive ? "block" : "hidden sm:block"}`}
                  >{item.label}</span
                >
              </div>
            {/each}
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="max-w-2xl mx-auto px-4 sm:px-8 py-10">
            <div in:fly={{ y: -12, duration: 250 }} class="mb-8">
              <div class="flex items-center gap-2 mb-2">
                <span
                  class="badge badge-outline border-primary/25 text-primary text-[9px] uppercase tracking-[0.2em] py-2 px-3 gap-1.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Étape {step} sur {STEPS.length}
                </span>
              </div>

              <h1
                class="font-display font-bold text-base-content leading-tight"
                style="font-size: clamp(1.5rem, 4vw, 2.2rem)"
              >
                {#if step === 1}
                  Informations <span class="italic font-light text-primary"
                    >essentielles</span
                  >
                {:else if step === 2}
                  Date <span class="italic font-light text-primary"
                    >&amp; Lieu</span
                  >
                {:else if step === 3}
                  Médias <span class="italic font-light text-primary"
                    >&amp; Visuels</span
                  >
                {:else if step === 4}
                  <span class="italic font-light text-primary">Billetterie</span
                  >
                {:else}
                  Options <span class="italic font-light text-primary"
                    >&amp; Publication</span
                  >
                {/if}
              </h1>

              <p class="text-sm text-base-content/40 mt-1">
                {#if step === 1}
                  Définissez les informations clés qui décrivent votre
                  événement.
                {:else if step === 2}
                  Indiquez quand et où se déroule votre événement.
                {:else if step === 3}
                  Ajoutez des visuels attractifs pour attirer les participants.
                {:else if step === 4}
                  Configurez vos catégories de billets et leurs tarifs.
                {:else}
                  Peaufinez les derniers détails avant de publier.
                {/if}
              </p>
            </div>

            <div transition:fade={{ duration: 150 }}>
              {#if step === 1}
                <Step1Infos
                  data={{
                    title: data.title,
                    category: data.category,
                    categoryEmoji: data.categoryEmoji,
                    description: data.description,
                    language: data.language,
                  }}
                  {categories}
                  {loadingMeta}
                  on:change={handleChildChange}
                />
              {:else if step === 2}
                <Step2DateTime
                  data={{
                    dateStart: data.dateStart,
                    timeStart: data.timeStart,
                    dateEnd: data.dateEnd,
                    timeEnd: data.timeEnd,
                    multiDay: data.multiDay,
                    venue: data.venue,
                    address: data.address,
                    city: data.city,
                    capacity: data.capacity,
                    isOnline: data.isOnline,
                    onlineUrl: data.onlineUrl,
                  }}
                  on:change={handleChildChange}
                />
              {:else if step === 3}
                <Step3Media
                  data={{
                    coverImage: data.coverImage,
                    gallery: data.gallery,
                    videoUrl: data.videoUrl,
                  }}
                  on:change={handleChildChange}
                />
              {:else if step === 4}
                <Step4Tickets
                  data={{
                    isFree: data.isFree,
                    tickets: data.tickets,
                    saleStart: data.saleStart,
                    saleEnd: data.saleEnd,
                  }}
                  on:change={handleChildChange}
                />
              {:else}
                <Step5Options
                  data={{
                    tags: data.tags,
                    ageRestriction: data.ageRestriction,
                    contactEmail: data.contactEmail,
                    website: data.website,
                  }}
                  {tags}
                  on:change={handleChildChange}
                />
              {/if}
            </div>

            {#if submitError}
              <div
                class="mt-4 flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3"
              >
                <AlertCircle size={15} class="shrink-0" />
                <span class="text-xs font-medium">{submitError}</span>
              </div>
            {/if}

            <div
              class="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-primary/10"
            >
              <button
                type="button"
                on:click={() => (step = Math.max(1, step - 1))}
                disabled={step === 1}
                class="btn btn-ghost rounded-full gap-2 text-xs uppercase tracking-widest border border-base-content/10 hover:border-primary/30 disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={14} />
                Retour
              </button>

              <div class="flex items-center gap-2 ml-auto">
                {#if step < STEPS.length}
                  <button
                    type="button"
                    on:click={() => (step = step + 1)}
                    disabled={!canGoNext}
                    class="btn btn-primary rounded-full gap-2 text-xs uppercase tracking-widest font-semibold px-7 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuer
                    <ArrowRight size={14} />
                  </button>
                {:else}
                  <button
                    type="button"
                    on:click={handleSubmit}
                    disabled={submitting}
                    class="btn btn-primary rounded-full gap-2 text-xs uppercase tracking-widest font-semibold px-8 animate-pulse hover:animate-none disabled:opacity-60"
                  >
                    {#if submitting}
                      <span class="loading loading-spinner loading-xs"></span>
                    {:else}
                      <Send size={14} />
                    {/if}
                    Publier
                  </button>
                {/if}
              </div>
            </div>

            {#if !canGoNext && step < STEPS.length}
              <div
                in:fade={{ duration: 150 }}
                out:fade={{ duration: 100 }}
                class="overflow-hidden"
              >
                <p
                  class="text-[11px] text-base-content/30 text-right mt-3 flex items-center justify-end gap-1.5"
                >
                  <ChevronRight size={10} class="text-warning/60" />
                  {#if step === 1}
                    Complétez le titre, la catégorie et la description pour
                    continuer.
                  {:else if step === 2}
                    La date, l&apos;heure de début et le lieu sont requis.
                  {:else if step === 3}
                    Ajoutez une image principale pour continuer.
                  {:else}
                    Activez « Gratuit » ou créez au moins une catégorie de
                    billet.
                  {/if}
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
