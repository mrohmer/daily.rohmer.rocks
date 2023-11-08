<script lang="ts">
  import {page} from '$app/stores';

  export let backLink: string | undefined = undefined
</script>
<div class="navbar bg-base-100 gap-2 container mx-auto">
    {#if backLink}
        <div class="flex-none">
            <a href={backLink} class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                </svg>

            </a>
        </div>
    {/if}
    <div class="flex-1">
        <slot/>
    </div>
    {#if !$page?.data?.session?.user?.id}
        <div class="flex-none">
            <a href="/auth/login" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </a>
        </div>
    {/if}
</div>
