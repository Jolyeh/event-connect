<script>
    export let label;
    export let value;
    export let required;
    export let accept;
</script>

<div class="w-full form-control gap-1.5">
    <label
        for=""
        class="label-text text-[10px] uppercase tracking-[0.2em] text-base-content/40 font-semibold"
    >
        {label}
        {#if required}
            <span class="text-primary">*</span>
        {/if}
    </label>
    <input
        type="file"
        class="file-input file-input-primary w-full bg-base-200 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20"
        bind:files={value}
        {accept}
    />
</div>
