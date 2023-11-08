<script lang="ts">
  import {goto} from '$app/navigation';
  import {v4 as uuid} from 'uuid';

  export let data: any

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
    return result[0];
  }

  const goToSession = (id: string) =>
    goto(`/s/${id}`);

  const onCreateSessionClick = () => async () => {
    const session = await createSession();
    await goToSession(session.id);
  }
</script>

<div class="container mx-auto">
    <div class="flex h-screen items-center justify-center gap-4">

        <div class="card w-96 bg-base-100 border-primary border shadow shadow-primary">
            <div class="card-body">
                <div class="flex gap-2 items-end">
                    <div class="form-control flex-1">
                        <label class="label">
                            <span class="label-text text-xs">Session ID</span>
                        </label>
                        <input type="text" placeholder="Type here" class="input input-bordered w-full"/>
                    </div>
                    <button class="btn btn-primary">Join</button>
                </div>
                <div class="divider">OR</div>
                {#if data?.session}
                    <button class="btn btn-primary" on:click={onCreateSessionClick()}>Create Session</button>
                {:else }
                    <a href="/auth/login" class="btn btn-primary">Login to Create Session</a>
                {/if}
            </div>
        </div>
    </div>
</div>
