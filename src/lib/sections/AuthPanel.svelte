<script>
    import { appName } from "$lib";
    import { Check, Zap } from "lucide-svelte";

    export let type;

    const features = [
        "Accès à 12 000+ événements",
        "Billetterie sécurisée & e-ticket",
        "Alertes personnalisées",
        "Historique & gestion des billets",
    ];

    const steps = [
        "Vérification de votre email",
        "Confirmation de votre email",
        "Modification du mot de passe",
        "Connection à votre compte",
    ];

    const images = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    ];
</script>

<div
    class="hidden lg:flex flex-col w-[45%] shrink-0 relative overflow-hidden bg-base-200"
>
    <div class="absolute inset-0">
        <img
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=900&q=80"
            alt="bg"
            class="w-full h-full object-cover opacity-20"
        />
    </div>
    <div
        class="absolute inset-0 bg-linear-to-br from-base-100/90 via-base-200/70 to-primary/10"
    ></div>
    <div class="absolute inset-0 opacity-5 leftPanel"></div>
    <div
        class="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14"
    >
        <a href="/" class="flex items-center gap-2.5 group w-fit">
            <div
                class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40"
            >
                <Zap
                    size={18}
                    class="text-primary-content"
                    fill="currentColor"
                />
            </div>
            <span
                class="font-display text-2xl font-bold text-primary tracking-wide"
                >{appName}</span
            >
        </a>

        <p
            class="text-[10px] uppercase tracking-[0.28em] text-primary font-semibold mt-4"
        >
            {type === "register"
                ? "Créez votre compte"
                : type === "login"
                  ? "Bon retour parmi nous"
                  : "Retouvez votre accès en un clic"}
        </p>

        <h2
            class="font-display font-bold text-base-content leading-[0.95] mb-6"
            style="font-size: clamp(2rem,4vw,3.2rem)"
        >
            {#if type === "register"}
                <p>
                    Vivez les meilleurs<br /><span
                        class="italic font-light text-primary">événements.</span
                    >
                </p>
            {:else if type === "login"}
                <p>
                    Content de vous<br /><span
                        class="italic font-light text-primary">revoir.</span
                    >
                </p>
            {:else}
                <p>
                    Nouveau mot de passe <br /><span
                        class="italic font-light text-primary"
                    >
                        nouvelle sérénité.</span
                    >
                </p>
            {/if}
        </h2>

        <p class="text-sm text-base-content/45 leading-relaxed max-w-sm mb-10">
            {type === "register"
                ? "Rejoignez les organisateurs et gérer vos événements éfficacement."
                : type === "login"
                  ? "Connectez-vous pour accéder à votre espace et avoir une idée de vos statistiques."
                  : "Récupération de votre mot de passe en seulement 04 étapes."}
        </p>
        <div class="flex flex-col gap-3">
            {#if type == null}
                {#each steps as s}
                    <div class="flex items-center gap-3">
                        <div
                            class="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0"
                        >
                            <Check size={10} class="text-primary" />
                        </div>
                        <span class="text-sm text-base-content/55">{s}</span>
                    </div>
                {/each}
            {:else}
                {#each features as f}
                    <div class="flex items-center gap-3">
                        <div
                            class="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0"
                        >
                            <Check size={10} class="text-primary" />
                        </div>
                        <span class="text-sm text-base-content/55">{f}</span>
                    </div>
                {/each}
            {/if}
        </div>
        <div class="flex items-center gap-4 pt-6 border-t border-primary/10">
            <div class="flex -space-x-2">
                {#each images as img}
                    <div
                        class="w-8 h-8 rounded-full border-2 border-base-200 overflow-hidden"
                    >
                        <img
                            {img}
                            alt=""
                            width={32}
                            height={32}
                            class="object-cover"
                        />
                    </div>
                {/each}
            </div>
            <div>
                <p class="text-xs font-semibold text-base-content/60">
                    850 000+ membres
                </p>
                <p class="text-[10px] text-base-content/30">
                    Rejoignez la communauté
                </p>
            </div>
        </div>
    </div>
</div>

<style>
    .leftPanel {
        background-image: linear-gradient(
                rgba(124, 58, 237, 1) 1px,
                transparent 1px
            ),
            linear-gradient(
                to right,
                rgba(124, 58, 237, 1) 1px,
                transparent 1px
            );
        background-size: 48px 48px;
    }
</style>
