<script lang="ts">
  import {ThemeSupa} from "@supabase/auth-ui-shared";
  import {Auth} from "@supabase/auth-ui-svelte";
  import type {PageData} from './$types';

  export let data: PageData;
</script>

<div class="container mx-auto">
    <div class="flex h-screen items-center justify-center gap-4">
        <div class="card w-96 bg-base-100 border-primary border shadow shadow-primary">
            <div class="card-body">
                {#if !data?.session}
                    <div class="row flex-center flex">
                        <div class="col-6 form-widget">
                            <Auth
                                    supabaseClient={data.supabase}
                                    view="magic_link"
                                    redirectTo={`${data.url}/auth/callback`}
                                    showLinks={false}
                                    appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
