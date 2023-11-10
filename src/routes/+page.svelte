<script lang="ts">
  import {goto} from '$app/navigation';
  import {v4 as uuid} from 'uuid';
  import type {PageData} from './$types';

  export let data: PageData;

  let joinId: string;
  let joining = false;

  const createSession = async () => {
    const {data: result, error} = await data.supabase
      .from('Session')
      .insert([
        {title: 'Daily', userid: data.session.user.id, id: uuid()},
      ])
      .select();

    if (error) {
      throw error;
    }
    return result?.[0]!;
  }

  const goToSession = (id: string) =>
    goto(`/s/${id}`);

  const onCreateSessionClick = () => async () => {
    const session = await createSession();
    await goToSession(session.id);
  }

  const onSubmitJoin = () => async () => {
    if (joining) {
      return;
    }
    joining = true;
    await goToSession(joinId);
  }
</script>

<svelte:head>
    <title>Daily Checklist</title>
</svelte:head>

<div class="container mx-auto">
    <div class="flex full-height items-center justify-center gap-4 flex-col py-5">

        <div class="card w-96 bg-base-100 border-primary border shadow shadow-primary">
            <div class="card-body">
                <form class="flex gap-2 items-end" on:submit|preventDefault={onSubmitJoin()}>
                    <div class="form-control flex-1">
                        <label class="label">
                            <span class="label-text text-xs">Session ID</span>
                        </label>
                        <input type="text" placeholder="Type here" class="input input-bordered w-full"
                               bind:value={joinId}/>
                    </div>
                    <button class="btn btn-primary" type="submit">
                        {#if joining}
                            <span class="loading loading-spinner"></span>
                        {:else }
                            Join
                        {/if}
                    </button>
                </form>
                <div class="divider">OR</div>
                {#if data?.session}
                    <button class="btn btn-primary" on:click={onCreateSessionClick()}>Create Session</button>
                {:else }
                    <a href="/auth/login" class="btn btn-primary">Login to Create Session</a>
                {/if}
            </div>
        </div>
        {#each data.dailies ?? [] as {id, title} (id)}
            <a href="/s/{id}" class="card w-96 bg-base-100 border shadow hover:bg-base-300">
                <div class="card-body py-4 pl-4 pr-2">
                    <div class="flex gap-2 items-center">
                        <div class="flex-1">
                            {title ? title : id}
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>
