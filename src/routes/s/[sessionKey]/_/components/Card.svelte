<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let checked = false;
  export let id: string;

  export let canCheck = false;
  export let canEdit = false;
  export let edit = false;
  export let loading = false;

  let value: string;

  const onCheckboxClick = () => () => {
    if (canCheck && !edit) {
      checked = !checked;
      dispatch('check', checked);
    }
  }

  const onAdd = () => () => {
    if (!value?.trim().length) {
      return;
    }
    dispatch('add', value.trim());
    value = '';
  }
  const onDelete = () => () => {
    dispatch('delete');
  }
  const onMakeAbsent = () => () => {
    dispatch('absent');
  }
</script>

<div class:cursor-not-allowed={!canCheck && !edit}>
    <svelte:element this={edit ? 'div' : 'label'}
                    class="card bg-base-100 border shadow transition-colors "
                    class:shadow-primary={checked}
                    class:shadow-neutral-600={!checked}
                    class:border-primary={checked}
                    class:border-neutral-600={!checked}
                    class:cursor-pointer={canCheck && !edit}
                    class:select-none={!edit}
                    class:pointer-events-none={!canCheck && !edit}
    >
        <div class="card-body justify-center pb-2" class:px-3={edit}>
            {#if !edit}
                <div class="card-actions absolute inset-x-2 top-2">
                    <input type="checkbox"
                           {checked}
                           {id}
                           class="checkbox"
                           on:change|preventDefault={onCheckboxClick()}/>
                    <div class="flex-1"></div>
                    {#if canEdit}
                        <button class="btn btn-circle btn-ghost scale-75 origin-top-right -mt-1.5 -mr-1.5"
                                on:click={onMakeAbsent()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
                            </svg>

                        </button>
                        <button class="btn btn-circle btn-ghost scale-75 origin-top-right -mt-1.5 -mr-1.5"
                                on:click={onDelete()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                            </svg>
                        </button>
                    {/if}
                </div>
            {/if}
            <svelte:element this={edit ? 'form' : 'div'}
                            class="aspect-video flex justify-center items-center gap-2 flex-col"
                            on:submit|preventDefault={onAdd()}>
                {#if loading}
                    <div class="loading loading-ball loading-md"></div>
                {:else }
                    <div class="text-2xl md:text-3xl text-center">
                        {#if edit}
                            <input type="text" bind:value placeholder="Participant"
                                   class="input input-ghost w-full max-w-xs"/>
                        {:else }
                            <slot/>
                        {/if}
                    </div>
                    {#if edit}
                        <button class="btn btn-glass w-full" type="submit">add</button>
                    {/if}
                {/if}
            </svelte:element>
        </div>
    </svelte:element>
</div>
