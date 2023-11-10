<script lang="ts">
  import daisyuiColors from 'daisyui/src/theming/themes';
  import {ThemeSupa} from "@supabase/auth-ui-shared";
  import {Auth} from "@supabase/auth-ui-svelte";
  import type {PageData} from './$types';
  import {browser} from '$app/environment';

  export let data: PageData;

  $: clientUrl = browser ? `${window.location.protocol}//${window.location.host}` : undefined;
  $: url = clientUrl ?? data?.url;
</script>

<div class="container mx-auto">
    <div class="flex h-screen items-center justify-center gap-4">
        <div class="card w-96 bg-base-100 border-primary border shadow shadow-primary">
            <div class="card-body">
                {#if !data?.session}
                    <Auth supabaseClient={data.supabase}
                          view="magic_link"
                          redirectTo={`${url}/auth/callback`}
                          showLinks={false}
                          appearance={{
                              theme: ThemeSupa,
                              extend: true,
                              className: {
                                button: 'btn btn-primary',
                              },
                              variables: {
                                default: {
                                  colors: {
                                    brand: daisyuiColors["[data-theme=dark]"].primary,
                                    brandAccent: daisyuiColors["[data-theme=dark]"].primary,
                                  },
                                },
                              },
                            }}
                          theme="dark"
                    />
                {/if}
            </div>
        </div>
    </div>
</div>
