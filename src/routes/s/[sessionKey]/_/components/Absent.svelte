<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  export let absent: Date;
  export let canEdit = false;

  const dispatcher = createEventDispatcher();

  const dispatch = (event: string) => () => dispatcher(event);

  $: day = absent?.toLocaleDateString('en', {
    weekday: 'long'
  })
  $: date = absent?.toLocaleDateString('de', {
    day: '2-digit',
    month: '2-digit',
  });
</script>

<div class="flex gap-px items-center">
    <div class="flex-1">
        <span class="font-bold"><slot/></span>
        {#if date}
            <span class="text-sm">absent until {day}, {date}</span>
        {/if}
    </div>
    {#if canEdit}
        <button class="btn btn-square scale-75" on:click={dispatch('decrement')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"/>
            </svg>
        </button>
        <button class="btn btn-square scale-75" on:click={dispatch('increment')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

        </button>
    {/if}
</div>
