<section
    class="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
>
    <!-- BG layers – all tailwind -->
    <div
        class="absolute inset-0 bg-linear-to-br from-base-100 via-base-100 to-secondary/30"
    ></div>
    <div
        class="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-primary/6 blur-3xl pointer-events-none"
    ></div>
    <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/4 blur-3xl pointer-events-none"
    ></div>

    <!-- Grid pattern overlay -->
    <div
        class="absolute inset-0 opacity-5 pointer-events-none"
        style="background-image: linear-gradient(oklch(var(--p)) 1px, transparent 1px), linear-gradient(to right, oklch(var(--p)) 1px, transparent 1px); background-size: 60px 60px;"
    ></div>

    <!-- Floating orbs -->
    <div
        class="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-primary/40 blur-sm animate-float pointer-events-none"
    ></div>
    <div
        class="absolute bottom-1/3 left-1/5 w-2 h-2 rounded-full bg-accent/60 blur-sm animate-float pointer-events-none"
    ></div>
    <div
        class="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-primary/30 blur-sm animate-float pointer-events-none"
    ></div>

    <div
        class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-15 lg:py-15"
    >
        <div>
            <!-- Badge -->
            <div class="mb-7">
                <span
                    class="inline-flex items-center gap-2 border border-primary/25 bg-primary/8 text-primary text-[10px] font-semibold uppercase tracking-[0.22em] py-2 px-4 rounded-full"
                >
                    <span
                        class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                    ></span>
                    Plateforme événementielle
                </span>
            </div>

            <!-- Headline -->
            <div class="mb-8">
                <h1
                    class="font-display font-bold leading-[0.9] text-base-content mb-2"
                    style="font-size: clamp(3rem, 10vw, 5.5rem);"
                >
                    Vivez l'instant
                </h1>
                <h1
                    class="font-display font-light italic leading-[0.9] text-primary"
                    style="font-size: clamp(3rem, 10vw, 5.5rem);"
                >
                    présent.
                </h1>
            </div>

            <!-- Subtext -->
            <p
                class="text-base-content/45 text-base lg:text-lg leading-relaxed max-w-lg mb-10"
            >
                Des milliers d'événements soigneusement sélectionnés — concerts,
                expositions, conférences, galas — participez à vos prochaines
                expériences.
            </p>
        </div>
    </div>

    <!-- Scroll cue -->
    <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
    >
        <span
            class="text-[9px] uppercase tracking-[0.25em] text-base-content/15"
            >Défiler</span
        >
        <div
            class="w-px h-10 bg-linear-to-b from-primary/40 to-transparent"
        ></div>
    </div>
</section>
