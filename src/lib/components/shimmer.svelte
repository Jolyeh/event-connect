<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {#each Array(8) as _}
        <div class="card bg-base-200 border border-base-300 overflow-hidden">
            <div class="skeleton h-52 rounded-none"></div>
            <div class="p-5 space-y-3">
                <div class="skeleton h-3 w-16 rounded-full"></div>
                <div class="skeleton h-5 w-full rounded"></div>
                <div class="skeleton h-4 w-3/4 rounded"></div>
                <div class="skeleton h-3 w-1/2 rounded"></div>
            </div>
        </div>
    {/each}
</div>
