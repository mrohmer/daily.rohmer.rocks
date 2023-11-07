<script lang="ts">
  import {debounceTime} from '$lib/utils/debounce-time';
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let title: string;
  export let canEdit = false;

  const onChange = () => debounceTime(
    () => {
      dispatch('change');
    },
    500
  );

</script>

{#if canEdit}
    <h1 class="text-3xl p-0 h-fit"
        contenteditable
        class:input={canEdit}
        on:input={onChange()}
        bind:textContent={title}
    >
        {title ?? ''}
    </h1>
{:else}
    <h1 class="text-3xl p-0 h-fit">
        {title ?? ''}
    </h1>
{/if}
