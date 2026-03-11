<script>
  import { appName } from "$lib";
  import {
    Zap,
    Instagram,
    Twitter,
    Linkedin,
    ArrowUpRight,
  } from "lucide-svelte";

  export let footerLinks = {
    Explorer: [
      { label: "Accueil", href: "/" },
      { label: "Événements", href: "/event" },
      { label: "En vedette", href: "/en-vedette" },
      { label: "Recherche", href: "/event" },
    ],
    Organisateurs: [
      { label: "Publier un événement", href: "/event/create" },
      { label: "Authentification", href: "/auth/login" },
      { label: "Profil organisateur", href: "/user/profile" },
      { label: "Support", href: "/terms/support" },
    ],
    Entreprise: [
      { label: "CGU", href: "/terms/cgu" },
      { label: "Confidentialité", href: "/terms/privacy" },
      { label: "Cookies", href: "/terms/cookies" },
      { label: "Mentions légales", href: "/terms/mention" },
    ],
  };

  export let socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  export let year = new Date().getFullYear();
</script>

<footer class="bg-base-200 border-t border-primary/8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-16 grid grid-cols-2 lg:grid-cols-5 gap-10">
      <div class="col-span-2">
        <a href="/" class="flex items-center gap-2.5 mb-5 group w-fit">
          <div
            class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-200"
          >
            <Zap size={18} class="text-primary-content" fill="currentColor" />
          </div>
          <span
            class="font-display text-2xl font-bold tracking-wide text-primary"
            >{appName}</span
          >
        </a>

        <p class="text-sm text-base-content/40 leading-relaxed max-w-xs mb-6">
          La plateforme événementielle qui connecte les passionnés aux
          expériences qui comptent vraiment.
        </p>

        <div class="flex gap-2">
          {#each socials as social}
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              class="btn btn-circle btn-sm btn-ghost border border-primary/15 hover:border-primary/40 hover:text-primary text-base-content/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <svelte:component this={social.icon} size={14} />
            </a>
          {/each}
        </div>
      </div>

      {#each Object.entries(footerLinks) as [title, items]}
        <div>
          <h4
            class="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/75 mb-4"
          >
            {title}
          </h4>
          <ul class="flex flex-col gap-2.5">
            {#each items as item}
              <li>
                <a
                  href={item.href}
                  class="text-sm text-base-content/40 hover:text-primary transition-colors duration-200 flex items-center gap-1 group w-fit"
                >
                  {item.label}
                  <ArrowUpRight
                    size={11}
                    class="opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all duration-200"
                  />
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <div
      class="py-6 border-t border-primary/6 flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <p class="text-xs text-base-content/20">
        © {year}
        {appName}. Tous droits réservés.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        {#each [{ label: "Confidentialité", href: "/terms/privacy" }, { label: "Cookies", href: "/terms/cookies" }, { label: "Mentions légales", href: "/terms/mention" }] as link}
          <a
            href={link.href}
            class="text-xs text-base-content/20 hover:text-base-content/50 transition-colors duration-200"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>
