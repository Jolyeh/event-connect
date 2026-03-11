<script>
    import { navigating } from "$app/stores";
    import { Zap } from "lucide-svelte";
</script>

{#if $navigating}
    <div
        class="fixed inset-0 z-100 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-md"
    >
        <div class="relative flex flex-col items-center">
            <!-- Logo Container avec effets de rayonnement -->
            <div class="relative mb-10">
                <!-- Cercles d'ondes en arrière-plan -->
                {#each [1, 2, 3] as a}
                    <div
                        class="absolute inset-0 rounded-full border border-primary/20"
                    ></div>
                {/each}

                <!-- Cœur du logo -->
                <div
                    class="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(var(--p),0.3)]"
                >
                    <div>
                        <Zap
                            size={32}
                            class="text-primary"
                            fill="currentColor"
                        />
                    </div>
                </div>
            </div>

            <!-- Texte avec animation de lettres ou de fondu -->
            <div class="space-y-3 text-center">
                <h2
                    class="font-display text-3xl font-black tracking-tighter text-base-content"
                >
                    Event<span class="text-primary"> Connect</span>
                </h2>

                <!-- Barre de progression indéterminée "soft" -->
                <progress
                    class="progress relative w-40 h-1 text-primary bg-base-content/5 rounded-full overflow-hidden mx-auto"
                ></progress>

                <p
                    class="text-[10px] uppercase tracking-[0.3em] text-base-content/40 font-bold"
                >
                    Préparation de votre expérience
                </p>
            </div>
        </div>

        <!-- Décoration subtile en arrière-plan -->
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg aspect-square bg-primary/5 blur-[120px] rounded-full -z-10"
        ></div>
    </div>
{/if}
