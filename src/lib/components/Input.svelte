<script>
    import { Eye, EyeOff } from "lucide-svelte";

    export let label;
    export let value;
    export let type = "text";
    export let required;
    export let placeholder;
    export let condition;
    export let input;

    let showPassword = false;

    $: inputType =
        type === "password" ? (showPassword ? "text" : "password") : type;
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
        {#if condition}
            <span class="label-text-alt text-[10px] text-base-content/25"
                >{condition}</span
            >
        {/if}
    </label>

    <div class="relative w-full">
        <input
            class="input input-bordered w-full bg-base-200 border-primary/15 focus:border-primary/50 focus:outline-none text-sm rounded-xl h-11 placeholder:text-base-content/20 pr-12"
            type={inputType}
            bind:value
            {placeholder}
            on:input={input}
        />

        {#if type === "password"}
            <button
                type="button"
                on:click={() => (showPassword = !showPassword)}
                class="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-base-content/40 hover:text-primary transition-colors"
                aria-label={showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"}
            >
                {#if showPassword}
                    <EyeOff size={18} />
                {:else}
                    <Eye size={18} />
                {/if}
            </button>
        {/if}
    </div>
</div>
