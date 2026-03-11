<script>
    import { apiUrl } from "$lib/utils/api_url";
    import { CheckCircle, Send } from "lucide-svelte";

    let email;
    let status = false;
    let loading = false;
    let error;
    let message;

    async function handleSubmit() {
        error = null;
        loading = true;
        try {
            const res = await fetch(`${apiUrl}/newsletters/subscribe`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const json = await res.json();

            if (json.status) {
                message = json.message;
                status = true;
            } else error = json.message;
        } catch {
            toast.error("Une erreur est survenue.");
        } finally {
            loading = false;
        }
    }
</script>

<section class="py-20 lg:py-32 bg-base-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
            class="relative card bg-base-200 border border-primary/12 overflow-hidden"
        >
            <div
                class="card-body items-center text-center py-16 lg:py-24 px-6 lg:px-20 relative z-10"
            >
                <p
                    class="text-[10px] uppercase tracking-[0.28em] text-primary font-semibold mb-3"
                >
                    Ne rien manquer
                </p>
                <h2
                    class="font-display font-bold text-base-content leading-tight mb-4"
                    style="font-size: clamp(2rem, 5vw, 3.5rem)"
                >
                    Restez dans <span class="italic font-light text-primary"
                        >la boucle</span
                    >
                </h2>
                <p
                    class="text-sm text-base-content/45 leading-relaxed max-w-sm mb-10"
                >
                    Recevez une sélection personnalisée des meilleurs événements
                    chaque semaine.
                </p>

                <form class="w-full max-w-md">
                    {#if status}
                        <div
                            class="flex items-center justify-center gap-3 bg-primary/10 border border-primary/25 rounded-2xl px-6 py-4 w-full"
                        >
                            <CheckCircle size={18} class="text-primary" />
                            <span class="text-primary text-sm font-medium"
                                >{message}</span
                            >
                        </div>
                    {:else}
                        <div class="join w-full">
                            <input
                                type="email"
                                bind:value={email}
                                placeholder="votre@email.com"
                                class="input input-bordered join-item flex-1 bg-base-300 border-primary/18 focus:border-primary/50 focus:outline-none text-sm"
                                required
                                disabled={status}
                            />
                            <button
                                type="button"
                                on:click={handleSubmit}
                                disabled={status}
                                class="btn btn-primary join-item text-xs uppercase tracking-widest gap-2 px-6 min-w-[140px]"
                            >
                                {#if loading}
                                    <span
                                        class="loading loading-spinner loading-xs"
                                    ></span>
                                {:else}
                                    <div class="flex gap-1 items-center">
                                        S'abonner <Send size={13} />
                                    </div>
                                {/if}
                            </button>
                        </div>
                    {/if}
                </form>

                {#if error}
                    <p class="text-error text-sm mt-3">{error}</p>
                {/if}
                <p
                    class="text-[10px] uppercase tracking-[0.18em] text-base-content/18 mt-4"
                >
                    Pas de spam · Désinscription en 1 clic
                </p>
            </div>
        </div>
    </div>
</section>
