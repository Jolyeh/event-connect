<script>
  import { onMount } from "svelte";
  import { fly, slide, fade } from "svelte/transition";
  import { Menu, X, Zap, LogOut, User } from "lucide-svelte";
  import { appName } from "$lib";
  import { page } from "$app/stores";
  import { apiUrl } from "$lib/utils/api_url";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";

  let links = [
    { label: "Explorer", href: "/" },
    { label: "Catégories", href: "/event/categories" },
    { label: "Evènements", href: "/event" },
  ];

  let scrolled = false;
  let open = false;

  let isLoggedIn = true;
  let currentPath = "";

  $: currentPath = $page.url.pathname;
  $: isOnProfile = currentPath === "/user/profile";
  $: authHref = isLoggedIn && !isOnProfile ? "/user/profile" : "/auth/login";
  $: authLabel =
    isLoggedIn && isOnProfile
      ? "Déconnexion"
      : isLoggedIn
        ? "Mon compte"
        : "Connexion";

  // Ferme automatiquement le menu lors du changement de page
  $: if (currentPath) {
    open = false;
  }

  const handleLogout = async () => {
    open = false;

    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        credentials: "include",
        method: "GET",
      });

      const resp = await response.json();

      if (resp.status) {
        goto("/auth/login", { replaceState: true });
        toast.success(resp.message);
      } else {
        toast.error(resp.message);
      }
    } catch (e) {
      toast.error("Une erreur est survenue");
      console.error("error:", e);
    }
  };

  const handleAuthClick = () => {
    open = false;
  };

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 50;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

<header
  class={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
    scrolled
      ? "bg-base-100/90 backdrop-blur-2xl border-b border-primary/10 shadow-2xl shadow-black/10"
      : "bg-transparent"
  }`}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 lg:h-20">
      <a href="/" class="flex items-center gap-2.5 group shrink-0">
        <div
          class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-105 transition-transform duration-200"
        >
          <Zap size={18} class="text-primary-content" fill="currentColor" />
        </div>
        <span class="font-display text-2xl font-bold tracking-wide text-primary">
          {appName}
        </span>
      </a>

      <nav class="hidden lg:flex items-center gap-1">
        {#each links as link}
          <a
            href={link.href}
            class={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 ${
              currentPath === link.href
                ? "text-primary bg-primary/8"
                : "text-base-content/50 hover:text-primary hover:bg-primary/8"
            }`}
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center gap-2">
        {#if isLoggedIn && isOnProfile}
          <button
            type="button"
            on:click={handleLogout}
            class="btn btn-primary btn-sm rounded-xl text-xs uppercase tracking-widest font-semibold shadow-lg shadow-primary/30 hidden lg:flex px-6 gap-2"
          >
            Déconnexion
          </button>
        {:else}
          <a
            href={authHref}
            on:click={handleAuthClick}
            class="btn btn-primary btn-sm rounded-xl text-xs uppercase tracking-widest font-semibold shadow-lg shadow-primary/30 hidden lg:flex px-6 gap-2"
          >
            {authLabel}
          </a>
        {/if}

        <button
          type="button"
          on:click={() => (open = !open)}
          class="btn btn-ghost btn-circle btn-sm lg:hidden text-base-content/60"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {#if open}
            <span
              in:fly={{ y: -8, duration: 150 }}
              out:fly={{ y: 8, duration: 150 }}
            >
              <X size={22} />
            </span>
          {:else}
            <span
              in:fly={{ y: 8, duration: 150 }}
              out:fly={{ y: -8, duration: 150 }}
            >
              <Menu size={22} />
            </span>
          {/if}
        </button>
      </div>
    </div>
  </div>

  {#if open}
    <div
      in:slide={{ duration: 250 }}
      out:slide={{ duration: 220 }}
      class="absolute top-full left-0 w-full lg:hidden bg-base-200/98 backdrop-blur-2xl border-t border-primary/10 overflow-hidden shadow-xl"
    >
      <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
        {#each links as link, index}
          <div
            in:fly={{ x: -10, duration: 200, delay: index * 50 }}
            out:fade={{ duration: 120 }}
          >
            <a
              href={link.href}
              on:click={() => (open = false)}
              class={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-between group transition-all ${
                currentPath === link.href
                  ? "text-primary bg-primary/5"
                  : "text-base-content/60 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {link.label}
              <Zap
                size={14}
                class="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
              />
            </a>
          </div>
        {/each}

        <div class="pt-6 border-t border-base-content/5 flex flex-col gap-3 mt-4">
          {#if isLoggedIn && isOnProfile}
            <button
              type="button"
              on:click={handleLogout}
              class="btn btn-primary btn-md rounded-xl text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-primary/20 gap-2"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          {:else}
            <a
              href={authHref}
              on:click={() => {
                open = false;
                handleAuthClick();
              }}
              class="btn btn-primary btn-md rounded-xl text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-primary/20 gap-2"
            >
              {#if isLoggedIn}
                <User size={14} />
              {/if}
              {authLabel}
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>