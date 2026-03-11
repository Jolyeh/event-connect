<script>
    import SectionHeader from "$lib/components/SectionHeader.svelte";
    import { Search, Ticket, Sparkles } from "lucide-svelte";
    import { reveal } from "$lib/actions/reveal";
    const steps = [
        {
            num: "01",
            Icon: Search,
            title: "Explorez",
            desc: "Parcourez des milliers d'événements filtrés par catégorie, ville, date et budget. Notre algorithme vous recommande selon vos préférences.",
        },
        {
            num: "02",
            Icon: Ticket,
            title: "Réservez",
            desc: "Choisissez vos billets en quelques clics. Paiement sécurisé, confirmation instantanée et e-ticket directement sur votre téléphone.",
        },
        {
            num: "03",
            Icon: Sparkles,
            title: "Vivez",
            desc: "Présentez votre QR code à l'entrée et profitez pleinement. Partagez vos souvenirs et découvrez votre prochain coup de cœur.",
        },
    ];
</script>

<section class="py-20 lg:py-32 bg-base-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Comment" titleAccent="ça fonctionne ?" centered />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
            {#each steps as step, i}
                <div
                    use:reveal={{ delay: i * 200 }}
                    class="card bg-base-300 border border-primary/8 hover:border-primary/25 p-8 text-center transition-colors duration-300 group relative overflow-hidden"
                >
                    <!-- Large number BG -->
                    <div
                        class="font-display text-7xl lg:text-8xl font-bold text-primary/5 group-hover:text-primary/10 leading-none absolute top-4 right-4 transition-colors duration-300 select-none"
                    >
                        {step.num}
                    </div>

                    <!-- Icon -->
                    <div class="flex justify-center mb-5 relative z-10">
                        <div
                            class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-lg shadow-primary/10 group-hover:shadow-primary/30"
                        >
                            <step.Icon
                                size={24}
                                class="text-primary group-hover:text-primary-content transition-colors duration-300"
                            />
                        </div>
                    </div>

                    <h3
                        class="font-display text-2xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-200 relative z-10"
                    >
                        {step.title}
                    </h3>
                    <p
                        class="text-sm text-base-content/45 leading-relaxed relative z-10"
                    >
                        {step.desc}
                    </p>

                    <!-- Connector arrow on mobile -->
                    {#if i < steps.length - 1}
                        <div
                            class="mt-6 flex justify-center md:hidden relative z-10 opacity-30"
                        >
                            <div class="w-px h-6 bg-primary"></div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
