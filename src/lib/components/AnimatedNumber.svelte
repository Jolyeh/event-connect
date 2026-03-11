<script>
    import { onDestroy } from "svelte";

    export let value = 0;
    let shown = 0;
    let timer;

    function animate() {
        clearInterval(timer);

        shown = 0;
        let start = 0;

        const duration = 1200;
        const steps = 40;
        const increment = Math.max(1, Math.ceil(value / steps));

        timer = setInterval(() => {
            start += increment;

            if (start >= value) {
                shown = value;
                clearInterval(timer);
            } else {
                shown = start;
            }
        }, duration / steps);
    }

    $: animate();

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<span>{shown.toLocaleString("fr-FR")}</span>