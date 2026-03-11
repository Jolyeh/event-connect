<script>
  import { Check, ArrowRight, LayoutDashboard, Copy } from "lucide-svelte";

  let copied = false;
  let shareUrl = "https://example.com/events/votre-evenement";

  if (typeof window !== "undefined") {
    shareUrl = `${window.location.origin}/events/votre-evenement`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      copied = false;
    }
  }
</script>

<div class="flex flex-col items-center text-center py-8 lg:py-12">
  <div class="relative mb-8">
    <div
      class="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/20"
    >
      <Check size={44} class="text-primary" />
    </div>
    <div
      class="absolute inset-0 rounded-full border border-primary/15 animate-ping"
    ></div>
    <div class="absolute -inset-3 rounded-full border border-primary/8"></div>
    <div class="absolute -inset-6 rounded-full border border-primary/4"></div>
  </div>

  <div
    class="badge badge-outline border-warning/30 text-warning text-[10px] uppercase tracking-[0.2em] py-2.5 px-4 mb-5 gap-2"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
    En cours de validation
  </div>

  <h2
    class="font-display font-bold text-base-content mb-3"
    style="font-size: clamp(1.8rem, 4vw, 3rem)"
  >
    Événement <span class="italic font-light text-primary">soumis !</span>
  </h2>

  <p class="text-base-content/45 text-sm leading-relaxed max-w-md mb-10">
    Votre événement a été soumis avec succès. Notre équipe le validera sous 
    <strong class="text-primary">24 heures</strong>. Vous serez notifié par
    e-mail dès la publication.
  </p>

  <div class="flex flex-col sm:flex-row gap-3 max-w-md">
    <a
      href="/user/profile"
      class="btn btn-primary p-3 flex-1 rounded-full gap-2 uppercase tracking-widest font-semibold shadow-lg shadow-primary/25"
    >
      Mon profile
      <ArrowRight size={13} />
    </a>
  </div>
</div>
