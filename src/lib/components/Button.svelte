<script>
    export let label;
    export let onClick;
    export let type = "button";
    export let disabled = false;
    export let variant = "primary";
    export let soft = false;
</script>

<button
    {type}
    on:click={onClick}
    {disabled}
    class={`btn btn-${variant} ${soft ? "btn-soft" : ""} w-full rounded-xl gap-2 text-xs uppercase tracking-widest font-semibold mt-1 disabled:opacity-40`}
>
    {label}
</button>
