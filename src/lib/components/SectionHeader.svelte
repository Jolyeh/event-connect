<script>
    import { reveal } from "$lib/actions/reveal";

    export let title;
    export let titleAccent;
    export let description;
    export let centered = false;
</script>

<div use:reveal={{ delay: 20 }} class={`${centered ? "text-center" : ""} mb-12 lg:mb-16`}>
    <h2
        class="font-display font-bold text-base-content leading-[0.95]"
        style="font-size: clamp(2rem, 5vw, 3.5rem);"
    >
        {title}
        {#if titleAccent}
            <span class="font-light italic text-primary">{titleAccent}</span>
        {/if}
    </h2>
    {#if description}
        <p
            class={`text-base-content/45 text-sm lg:text-base leading-relaxed mt-4 ${centered ? "max-w-xl mx-auto" : "max-w-xl"}`}
        >
            {description}
        </p>
    {/if}
</div>
