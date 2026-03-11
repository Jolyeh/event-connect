<script>
    export let checked = false;
    export let onchange;
    export let required = false;

    function handleChange() {
        checked = !checked;
        if (onchange) onchange(checked);
    }
</script>

<label class="flex items-start gap-3 cursor-pointer">
    <input
        type="checkbox"
        class="checkbox checkbox-primary checkbox-sm mt-0.5 rounded"
        {checked}
        on:change={handleChange}
        {required}
    />
    <span class="text-xs text-base-content/40 leading-relaxed">
        <slot />
    </span>
</label>
