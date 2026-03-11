<script>
    import AnimatedNumber from "$lib/components/AnimatedNumber.svelte";

    const items = [
        {
            value: 150,
            label: "Événements actifs",
        },
        {
            value: 10,
            label: "Villes couvertes",
        },
        {
            value: 1500,
            label: "Participants",
        },
        {
            value: 99,
            label: "Satisfaction",
        },
    ];
</script>

<section class="border-y border-primary/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4">
            {#each items as item, index}
                <div
                    class={`flex flex-col items-center text-center py-8 px-4 gap-1 ${index < items.length - 1 ? "border-r border-primary/8" : ""}`}
                >
                    <div
                        class="font-display text-3xl font-bold text-primary"
                    >
                    {#if index ===3}
                        <AnimatedNumber value={item.value}/>%
                    {:else}
                        <AnimatedNumber value={item.value}/>
                    {/if}
                        
                    </div>
                    <div
                        class="text-[10px] uppercase tracking-[0.18em] text-base-content/25"
                    >
                        {item.label}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
