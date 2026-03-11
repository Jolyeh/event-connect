<script>
    const items = [
        "Concert",
        "Exposition",
        "Conférence",
        "Gala",
        "Festival",
        "Sport",
        "Bien-être",
        "Gastronomie",
        "Théâtre",
        "Cinéma",
        "Formation",
        "Culture",
    ];
</script>

<div class="bg-primary py-5 overflow-hidden relative">
    <div class="flex animate-scroll-left whitespace-nowrap">
        {#each items as item}
            <span
                class="inline-flex items-center gap-1 text-primary-content text-xs font-semibold uppercase tracking-widest mx-6 shrink-0"
            >
                {item}
                <span class="text-primary-content/40 ml-4">·</span>
            </span>
        {/each}
    </div>
</div>
